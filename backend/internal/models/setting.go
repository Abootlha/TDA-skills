package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// TestCentre represents a CITB test centre.
type TestCentre struct {
	ID        uuid.UUID      `db:"id" json:"id"`
	Name      string         `db:"name" json:"name"`
	Address   string         `db:"address" json:"address"`
	City      string         `db:"city" json:"city"`
	Postcode  string         `db:"postcode" json:"postcode"`
	Phone     sql.NullString `db:"phone" json:"phone,omitempty"`
	Email     sql.NullString `db:"email" json:"email,omitempty"`
	Capacity  int            `db:"capacity" json:"capacity"`
	IsActive  bool           `db:"is_active" json:"is_active"`
	CreatedAt time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt time.Time      `db:"updated_at" json:"updated_at"`
}

// LoginActivity records security-relevant login events.
type LoginActivity struct {
	ID         uuid.UUID       `db:"id" json:"id"`
	UserID     *uuid.UUID      `db:"user_id" json:"user_id,omitempty"`
	AdminID    *uuid.UUID      `db:"admin_id" json:"admin_id,omitempty"`
	EventType  string          `db:"event_type" json:"event_type"`
	IPAddress  sql.NullString  `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent  sql.NullString  `db:"user_agent" json:"user_agent,omitempty"`
	DeviceInfo json.RawMessage `db:"device_info" json:"device_info,omitempty"`
	Metadata   json.RawMessage `db:"metadata" json:"metadata,omitempty"`
	CreatedAt  time.Time       `db:"created_at" json:"created_at"`
}

// TwoFactorSecret stores the TOTP secret for a user.
type TwoFactorSecret struct {
	ID          uuid.UUID       `db:"id" json:"id"`
	UserID      uuid.UUID       `db:"user_id" json:"user_id"`
	Secret      string          `db:"secret" json:"-"`
	Method      string          `db:"method" json:"method"`
	IsEnabled   bool            `db:"is_enabled" json:"is_enabled"`
	BackupCodes json.RawMessage `db:"backup_codes" json:"-"`
	LastUsedAt  *time.Time      `db:"last_used_at" json:"last_used_at,omitempty"`
	CreatedAt   time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time       `db:"updated_at" json:"updated_at"`
}

// EmailVerificationToken holds email verification data.
type EmailVerificationToken struct {
	ID         uuid.UUID  `db:"id" json:"id"`
	UserID     uuid.UUID  `db:"user_id" json:"user_id"`
	Token      string     `db:"token" json:"-"`
	ExpiresAt  time.Time  `db:"expires_at" json:"expires_at"`
	VerifiedAt *time.Time `db:"verified_at" json:"verified_at,omitempty"`
	CreatedAt  time.Time  `db:"created_at" json:"created_at"`
}

// PasswordResetToken holds password reset data.
type PasswordResetToken struct {
	ID        uuid.UUID      `db:"id" json:"id"`
	UserID    uuid.UUID      `db:"user_id" json:"user_id"`
	Token     string         `db:"token" json:"-"`
	ExpiresAt time.Time      `db:"expires_at" json:"expires_at"`
	RevokedAt *time.Time     `db:"revoked_at" json:"revoked_at,omitempty"`
	IPAddress sql.NullString `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent sql.NullString `db:"user_agent" json:"user_agent,omitempty"`
	CreatedAt time.Time      `db:"created_at" json:"created_at"`
}

// UserSession represents an active user login session.
type UserSession struct {
	ID                  uuid.UUID       `db:"id" json:"id"`
	UserID              uuid.UUID       `db:"user_id" json:"user_id"`
	TokenHash           string          `db:"token_hash" json:"-"`
	IPAddress           sql.NullString  `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent           sql.NullString  `db:"user_agent" json:"user_agent,omitempty"`
	DeviceInfo          json.RawMessage `db:"device_info" json:"device_info,omitempty"`
	TwoFactorVerified   bool            `db:"two_factor_verified" json:"two_factor_verified"`
	CreatedAt           time.Time       `db:"created_at" json:"created_at"`
	ExpiresAt           time.Time       `db:"expires_at" json:"expires_at"`
	RevokedAt           *time.Time      `db:"revoked_at" json:"revoked_at,omitempty"`
	LastActivity        time.Time       `db:"last_activity" json:"last_activity"`
}

// NotificationJob represents a queued email/sms/push job.
type NotificationJob struct {
	ID             uuid.UUID  `db:"id" json:"id"`
	NotificationID uuid.UUID `db:"notification_id" json:"notification_id"`
	JobType        string     `db:"job_type" json:"job_type"`
	Status         string     `db:"status" json:"status"`
	Attempts       int        `db:"attempts" json:"attempts"`
	MaxAttempts    int        `db:"max_attempts" json:"max_attempts"`
	LastError      *string    `db:"last_error" json:"last_error,omitempty"`
	ScheduledFor   time.Time  `db:"scheduled_for" json:"scheduled_for"`
	ProcessedAt    *time.Time `db:"processed_at" json:"processed_at,omitempty"`
	CreatedAt      time.Time  `db:"created_at" json:"created_at"`
}

// --- Request / Response DTOs ---

type TwoFactorSetupResponse struct {
	QRCodeURL   string   `json:"qr_code_url"`
	Secret      string   `json:"secret"`
	BackupCodes []string `json:"backup_codes"`
	Message     string   `json:"message"`
}

type TwoFactorCodeRequest struct {
	Code string `json:"code" validate:"required,len=6"`
}

type Verify2FARequest struct {
	UserID string `json:"user_id" validate:"required,uuid"`
	Code   string `json:"code" validate:"required,len=6"`
}

type BackupCodeRequest struct {
	UserID     string `json:"user_id" validate:"required,uuid"`
	BackupCode string `json:"backup_code" validate:"required,min=8,max=8"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password" validate:"required,min=8,max=128"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" validate:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword     string `json:"current_password" validate:"required"`
	NewPassword         string `json:"new_password" validate:"required,min=8,max=128"`
	LogoutOtherSessions bool   `json:"logout_other_sessions"`
}

type SessionResponse struct {
	ID           uuid.UUID       `json:"id"`
	DeviceInfo   json.RawMessage `json:"device_info,omitempty"`
	IPAddress    string          `json:"ip_address,omitempty"`
	CreatedAt    time.Time       `json:"created_at"`
	LastActivity time.Time       `json:"last_activity"`
	Current      bool            `json:"current"`
}

type ProfileResponse struct {
	User             *User              `json:"user"`
	Profile          *UserProfile       `json:"profile,omitempty"`
	Address          *UserAddress       `json:"address,omitempty"`
	TwoFactorEnabled bool              `json:"two_factor_enabled"`
	Sessions         []SessionResponse  `json:"sessions,omitempty"`
	LoginHistory     []LoginActivity    `json:"login_history,omitempty"`
}
