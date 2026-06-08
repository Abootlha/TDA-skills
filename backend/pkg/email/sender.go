package email

import (
	"fmt"
	"net/smtp"
	"strings"

	"github.com/tdaskills/backend/internal/config"
)

// Sender handles email sending via SMTP.
type Sender struct {
	cfg config.SMTPConfig
}

// NewSender creates a new email sender.
func NewSender(cfg config.SMTPConfig) *Sender {
	return &Sender{cfg: cfg}
}

// Send sends an email.
func (s *Sender) Send(to []string, subject, htmlBody string) error {
	if s.cfg.Host == "" {
		return fmt.Errorf("SMTP not configured")
	}

	from := fmt.Sprintf("%s <%s>", s.cfg.FromName, s.cfg.FromEmail)

	headers := make(map[string]string)
	headers["From"] = from
	headers["To"] = strings.Join(to, ", ")
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=\"utf-8\""

	var msg strings.Builder
	for k, v := range headers {
		msg.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	msg.WriteString("\r\n")
	msg.WriteString(htmlBody)

	auth := smtp.PlainAuth("", s.cfg.User, s.cfg.Password, s.cfg.Host)
	addr := fmt.Sprintf("%s:%d", s.cfg.Host, s.cfg.Port)

	return smtp.SendMail(addr, auth, s.cfg.FromEmail, to, []byte(msg.String()))
}

// SendBookingConfirmation sends a booking confirmation email.
func (s *Sender) SendBookingConfirmation(to, bookingNumber, courseName string) error {
	subject := fmt.Sprintf("Booking Confirmed - %s", bookingNumber)
	body := fmt.Sprintf(`
		<h2>Booking Confirmed!</h2>
		<p>Your booking <strong>%s</strong> for <strong>%s</strong> has been confirmed.</p>
		<p>You can view your booking in your <a href="https://tdaskills.co.uk/dashboard/bookings">dashboard</a>.</p>
		<p>Thank you for choosing TDA Skills!</p>
	`, bookingNumber, courseName)
	return s.Send([]string{to}, subject, body)
}

// SendPaymentReceipt sends a payment receipt email.
func (s *Sender) SendPaymentReceipt(to, paymentNumber string, amount float64) error {
	subject := fmt.Sprintf("Payment Receipt - %s", paymentNumber)
	body := fmt.Sprintf(`
		<h2>Payment Received</h2>
		<p>Payment <strong>%s</strong> of <strong>£%.2f</strong> has been processed.</p>
		<p>Thank you!</p>
	`, paymentNumber, amount)
	return s.Send([]string{to}, subject, body)
}
