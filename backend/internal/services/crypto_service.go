package services

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"crypto/sha256"
	"encoding/base32"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"
	"time"
	"unicode"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"

	"github.com/tdaskills/backend/internal/models"
)

// CryptoService handles TOTP 2FA, token generation, and password validation.
type CryptoService struct {
	db *sqlx.DB
}

func NewCryptoService(db *sqlx.DB) *CryptoService {
	return &CryptoService{db: db}
}

// --- TOTP 2FA ---

// GenerateTOTPSecret creates a new Base32-encoded TOTP secret (20 bytes).
func (s *CryptoService) GenerateTOTPSecret() (string, error) {
	secret := make([]byte, 20)
	if _, err := rand.Read(secret); err != nil {
		return "", err
	}
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(secret), nil
}

// GenerateQRCodeURL creates the otpauth:// URI for authenticator apps.
func (s *CryptoService) GenerateQRCodeURL(email, secret string) string {
	return fmt.Sprintf("otpauth://totp/TDASkills:%s?secret=%s&issuer=TDASkills&digits=6&period=30", email, secret)
}

// VerifyTOTP validates a 6-digit TOTP code against the secret.
// Allows 1 step drift (30s behind or ahead) for clock skew.
func (s *CryptoService) VerifyTOTP(secret, code string) bool {
	now := time.Now().Unix()
	for _, offset := range []int64{-30, 0, 30} {
		timestamp := now + offset
		expected := s.generateTOTPCode(secret, timestamp/30)
		if expected == code {
			return true
		}
	}
	return false
}

// generateTOTPCode generates a TOTP code for a given counter using HOTP (HMAC-SHA1).
func (s *CryptoService) generateTOTPCode(secret string, counter int64) string {
	secretBytes, err := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString(strings.ToUpper(secret))
	if err != nil {
		return ""
	}

	// Convert counter to 8 bytes big-endian
	msg := make([]byte, 8)
	for i := 7; i >= 0; i-- {
		msg[i] = byte(counter & 0xff)
		counter >>= 8
	}

	// HMAC-SHA1
	mac := hmac.New(sha1.New, secretBytes)
	mac.Write(msg)
	hash := mac.Sum(nil)

	// Dynamic truncation
	offset := hash[len(hash)-1] & 0x0f
	code := int64(hash[offset]&0x7f)<<24 |
		int64(hash[offset+1])<<16 |
		int64(hash[offset+2])<<8 |
		int64(hash[offset+3])
	code = code % 1000000

	return fmt.Sprintf("%06d", code)
}

// --- Backup Codes ---

// GenerateBackupCodes creates 10 random 8-character backup codes.
func (s *CryptoService) GenerateBackupCodes() ([]string, error) {
	codes := make([]string, 10)
	chars := "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	for i := range codes {
		code := make([]byte, 8)
		for j := range code {
			n, err := rand.Int(rand.Reader, big.NewInt(int64(len(chars))))
			if err != nil {
				return nil, err
			}
			code[j] = chars[n.Int64()]
		}
		codes[i] = string(code)
	}
	return codes, nil
}

// HashBackupCode hashes a single backup code using bcrypt.
func (s *CryptoService) HashBackupCode(code string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(code), 10)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// VerifyBackupCode checks a code against a list of hashed codes.
// Returns the index of the matched code, or -1 if no match.
func (s *CryptoService) VerifyBackupCode(code string, hashedCodes []string) int {
	for i, hashed := range hashedCodes {
		if err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(code)); err == nil {
			return i
		}
	}
	return -1
}

// --- Token Generation ---

// GenerateSecureToken generates a cryptographically secure random token.
func (s *CryptoService) GenerateSecureToken(byteLength int) (string, error) {
	b := make([]byte, byteLength)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// HashToken creates a SHA-256 hash of a token (for storage).
func (s *CryptoService) HashToken(token string) string {
	h := sha256.Sum256([]byte(token))
	return hex.EncodeToString(h[:])
}

// --- Email Verification Token ---

// CreateEmailVerificationToken generates and stores a verification token.
func (s *CryptoService) CreateEmailVerificationToken(ctx context.Context, userID string) (string, error) {
	token, err := s.GenerateSecureToken(32)
	if err != nil {
		return "", err
	}

	tokenHash := s.HashToken(token)
	expiresAt := time.Now().Add(24 * time.Hour)

	query := `INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`
	_, err = s.db.ExecContext(ctx, query, userID, tokenHash, expiresAt)
	if err != nil {
		return "", err
	}

	return token, nil
}

// VerifyEmailToken checks if an email verification token is valid.
func (s *CryptoService) VerifyEmailToken(ctx context.Context, token string) (*models.EmailVerificationToken, error) {
	tokenHash := s.HashToken(token)
	var evt models.EmailVerificationToken
	query := `SELECT * FROM email_verification_tokens WHERE token = $1 AND expires_at > NOW() AND verified_at IS NULL`
	if err := s.db.GetContext(ctx, &evt, query, tokenHash); err != nil {
		return nil, err
	}
	return &evt, nil
}

// MarkEmailVerified sets verified_at on the token and email_verified on the user.
func (s *CryptoService) MarkEmailVerified(ctx context.Context, tokenID, userID string) error {
	tx, err := s.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	tx.ExecContext(ctx, `UPDATE email_verification_tokens SET verified_at = NOW() WHERE id = $1`, tokenID)
	tx.ExecContext(ctx, `UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1`, userID)

	return tx.Commit()
}

// --- Password Reset Token ---

// CreatePasswordResetToken generates and stores a password reset token.
func (s *CryptoService) CreatePasswordResetToken(ctx context.Context, userID, ipAddress, userAgent string) (string, error) {
	token, err := s.GenerateSecureToken(48)
	if err != nil {
		return "", err
	}

	tokenHash := s.HashToken(token)
	expiresAt := time.Now().Add(1 * time.Hour)

	query := `INSERT INTO password_reset_tokens (user_id, token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)`
	_, err = s.db.ExecContext(ctx, query, userID, tokenHash, expiresAt, ipAddress, userAgent)
	if err != nil {
		return "", err
	}

	return token, nil
}

// VerifyPasswordResetToken checks if a password reset token is valid.
func (s *CryptoService) VerifyPasswordResetToken(ctx context.Context, token string) (*models.PasswordResetToken, error) {
	tokenHash := s.HashToken(token)
	var prt models.PasswordResetToken
	query := `SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND revoked_at IS NULL`
	if err := s.db.GetContext(ctx, &prt, query, tokenHash); err != nil {
		return nil, err
	}
	return &prt, nil
}

// RevokePasswordResetToken marks a token as used.
func (s *CryptoService) RevokePasswordResetToken(ctx context.Context, tokenID string) error {
	_, err := s.db.ExecContext(ctx, `UPDATE password_reset_tokens SET revoked_at = NOW() WHERE id = $1`, tokenID)
	return err
}

// --- Password Validation ---

// ValidatePasswordStrength checks if a password meets all requirements:
// Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
func (s *CryptoService) ValidatePasswordStrength(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case unicode.IsPunct(r) || unicode.IsSymbol(r):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}
	if !hasDigit {
		return fmt.Errorf("password must contain at least one digit")
	}
	if !hasSpecial {
		return fmt.Errorf("password must contain at least one special character")
	}

	return nil
}

// --- Login Activity ---

// LogLoginActivity records a security event.
func (s *CryptoService) LogLoginActivity(ctx context.Context, activity *models.LoginActivity) error {
	query := `INSERT INTO login_activity (user_id, admin_id, event_type, ip_address, user_agent, device_info, metadata) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := s.db.ExecContext(ctx, query,
		activity.UserID, activity.AdminID, activity.EventType,
		activity.IPAddress.String, activity.UserAgent.String,
		activity.DeviceInfo, activity.Metadata,
	)
	return err
}

// GetLoginHistory returns recent login activity for a user.
func (s *CryptoService) GetLoginHistory(ctx context.Context, userID string, limit int) ([]models.LoginActivity, error) {
	var activities []models.LoginActivity
	query := `SELECT * FROM login_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`
	err := s.db.SelectContext(ctx, &activities, query, userID, limit)
	return activities, err
}
