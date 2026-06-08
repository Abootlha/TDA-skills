package services

import (
	"bytes"
	"context"
	"crypto/tls"
	"fmt"
	"html/template"
	"net/smtp"
	"os"
	"path/filepath"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
)

// EmailService handles HTML email template rendering and SMTP delivery.
type EmailService struct {
	cfg       *config.Config
	db        *sqlx.DB
	redis     *database.RedisClient
	templates map[string]*template.Template
}

// EmailJob represents a queued email to be sent.
type EmailJob struct {
	To           string            `json:"to"`
	Subject      string            `json:"subject"`
	TemplateName string            `json:"template_name"`
	Data         map[string]string `json:"data"`
	RetryCount   int               `json:"retry_count"`
}

// DefaultTemplateVars holds variables injected into every email.
type DefaultTemplateVars struct {
	SiteName       string
	SiteURL        string
	LogoURL        string
	UnsubscribeURL string
	CurrentYear    string
}

func NewEmailService(cfg *config.Config, db *sqlx.DB, redis *database.RedisClient) *EmailService {
	svc := &EmailService{
		cfg:       cfg,
		db:        db,
		redis:     redis,
		templates: make(map[string]*template.Template),
	}
	svc.loadTemplates()
	return svc
}

// loadTemplates parses all HTML templates from the templates directory.
func (s *EmailService) loadTemplates() {
	templateDir := "pkg/email/templates"
	basePath := filepath.Join(templateDir, "base.html")

	templateNames := []string{
		"email_verification",
		"password_reset",
		"booking_confirmed",
		"payment_received",
		"two_factor_code",
		"booking_reminder",
		"admin_alert",
		"password_changed",
		"admin_new_login",
	}

	for _, name := range templateNames {
		tmplPath := filepath.Join(templateDir, name+".html")
		if _, err := os.Stat(tmplPath); err != nil {
			continue
		}

		tmpl, err := template.ParseFiles(basePath, tmplPath)
		if err != nil {
			fmt.Printf("Warning: failed to parse template %s: %v\n", name, err)
			continue
		}
		s.templates[name] = tmpl
	}
}

// RenderTemplate renders an email template with provided data.
func (s *EmailService) RenderTemplate(templateName string, data map[string]string) (string, error) {
	tmpl, ok := s.templates[templateName]
	if !ok {
		return "", fmt.Errorf("template %s not found", templateName)
	}

	// Merge default vars
	mergedData := map[string]string{
		"SiteName":       "TDA Skills",
		"SiteURL":        "https://tdaskills.co.uk",
		"LogoURL":        "https://tdaskills.co.uk/logo.png",
		"UnsubscribeURL": "https://tdaskills.co.uk/unsubscribe",
		"CurrentYear":    fmt.Sprintf("%d", time.Now().Year()),
	}
	for k, v := range data {
		mergedData[k] = v
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, mergedData); err != nil {
		return "", err
	}
	return buf.String(), nil
}

// SendEmail sends an email via SMTP with TLS.
func (s *EmailService) SendEmail(to, subject, htmlBody string) error {
	smtpCfg := s.cfg.SMTP
	addr := fmt.Sprintf("%s:%d", smtpCfg.Host, smtpCfg.Port)

	headers := fmt.Sprintf(
		"From: %s <%s>\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nReply-To: %s\r\n\r\n",
		smtpCfg.FromName, smtpCfg.FromEmail, to, subject, smtpCfg.ReplyTo,
	)

	msg := []byte(headers + htmlBody)

	auth := smtp.PlainAuth("", smtpCfg.User, smtpCfg.Password, smtpCfg.Host)

	if smtpCfg.TLS {
		tlsConfig := &tls.Config{
			ServerName:         smtpCfg.Host,
			InsecureSkipVerify: smtpCfg.TLSInsecureSkip,
		}

		conn, err := tls.Dial("tcp", addr, tlsConfig)
		if err != nil {
			return fmt.Errorf("TLS dial failed: %w", err)
		}
		defer conn.Close()

		client, err := smtp.NewClient(conn, smtpCfg.Host)
		if err != nil {
			return fmt.Errorf("SMTP client creation failed: %w", err)
		}
		defer client.Quit()

		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("SMTP auth failed: %w", err)
		}

		if err := client.Mail(smtpCfg.FromEmail); err != nil {
			return fmt.Errorf("SMTP mail from failed: %w", err)
		}

		if err := client.Rcpt(to); err != nil {
			return fmt.Errorf("SMTP rcpt to failed: %w", err)
		}

		w, err := client.Data()
		if err != nil {
			return fmt.Errorf("SMTP data failed: %w", err)
		}

		_, err = w.Write(msg)
		if err != nil {
			return fmt.Errorf("SMTP write failed: %w", err)
		}

		return w.Close()
	}

	return smtp.SendMail(addr, auth, smtpCfg.FromEmail, []string{to}, msg)
}

// SendTemplatedEmail renders a template and sends the email.
func (s *EmailService) SendTemplatedEmail(to, templateName, subject string, data map[string]string) error {
	body, err := s.RenderTemplate(templateName, data)
	if err != nil {
		return err
	}
	return s.SendEmail(to, subject, body)
}

// --- Email Queue Worker ---

// QueueEmail adds an email job to the Redis queue for async processing.
func (s *EmailService) QueueEmail(ctx context.Context, to, templateName, subject string, data map[string]string) error {
	// Also create a notification_job record
	query := `INSERT INTO notification_jobs (job_type, status, scheduled_for) VALUES ('email', 'pending', NOW()) RETURNING id`
	var jobID string
	if err := s.db.GetContext(ctx, &jobID, query); err != nil {
		return err
	}

	// Queue in Redis for the worker to pick up
	jobJSON := fmt.Sprintf(`{"id":"%s","to":"%s","template":"%s","subject":"%s"}`, jobID, to, templateName, subject)
	return s.redis.LPush(ctx, "email:jobs", jobJSON)
}

// StartEmailWorker runs a background goroutine that processes email jobs from the Redis queue.
func (s *EmailService) StartEmailWorker(ctx context.Context) {
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				// Poll queue every 5 seconds
				result, err := s.redis.BRPop(ctx, 5*time.Second, "email:jobs")
				if err != nil || len(result) < 2 {
					continue
				}

				// Process job (simplified — in production, parse JSON and render template)
				jobData := result[1]
				_ = jobData

				// Mark job as processed
				// In full implementation: parse job, render template, send email, update DB status
			}
		}
	}()
}
