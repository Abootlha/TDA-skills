package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// User represents a learner account.
type User struct {
	ID            uuid.UUID      `db:"id" json:"id"`
	Email         string         `db:"email" json:"email"`
	PasswordHash  string         `db:"password_hash" json:"-"`
	FirstName     string         `db:"first_name" json:"first_name"`
	LastName      string         `db:"last_name" json:"last_name"`
	Phone         sql.NullString `db:"phone" json:"phone,omitempty"`
	DateOfBirth   *time.Time     `db:"date_of_birth" json:"date_of_birth,omitempty"`
	AvatarURL     sql.NullString `db:"avatar_url" json:"avatar_url,omitempty"`
	EmailVerified bool           `db:"email_verified" json:"email_verified"`
	IsActive      bool           `db:"is_active" json:"is_active"`
	IsLocked      bool           `db:"is_locked" json:"is_locked"`
	LockedUntil   *time.Time     `db:"locked_until" json:"-"`
	LoginAttempts int            `db:"login_attempts" json:"-"`
	LastLogin     *time.Time     `db:"last_login" json:"last_login,omitempty"`
	CreatedAt     time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt     time.Time      `db:"updated_at" json:"updated_at"`
}

// UserProfile holds extended user information for the construction industry.
type UserProfile struct {
	ID                           uuid.UUID      `db:"id" json:"id"`
	UserID                       uuid.UUID      `db:"user_id" json:"user_id"`
	Occupation                   sql.NullString `db:"occupation" json:"occupation,omitempty"`
	Employer                     sql.NullString `db:"employer" json:"employer,omitempty"`
	YearsExperience              *int           `db:"years_experience" json:"years_experience,omitempty"`
	NINNumber                    sql.NullString `db:"nin_number" json:"nin_number,omitempty"`
	CSCSCardNumber               sql.NullString `db:"cscs_card_number" json:"cscs_card_number,omitempty"`
	CITBNumber                   sql.NullString `db:"citb_number" json:"citb_number,omitempty"`
	EmergencyContactName         sql.NullString `db:"emergency_contact_name" json:"emergency_contact_name,omitempty"`
	EmergencyContactPhone        sql.NullString `db:"emergency_contact_phone" json:"emergency_contact_phone,omitempty"`
	EmergencyContactRelationship sql.NullString `db:"emergency_contact_relationship" json:"emergency_contact_relationship,omitempty"`
	MarketingConsent             bool           `db:"marketing_consent" json:"marketing_consent"`
	SMSNotifications             bool           `db:"sms_notifications" json:"sms_notifications"`
	EmailNotifications           bool           `db:"email_notifications" json:"email_notifications"`
	CreatedAt                    time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt                    time.Time      `db:"updated_at" json:"updated_at"`
}

// UserAddress represents a user's postal address.
type UserAddress struct {
	ID           uuid.UUID      `db:"id" json:"id"`
	UserID       uuid.UUID      `db:"user_id" json:"user_id"`
	AddressLine1 sql.NullString `db:"address_line1" json:"address_line1,omitempty"`
	AddressLine2 sql.NullString `db:"address_line2" json:"address_line2,omitempty"`
	City         sql.NullString `db:"city" json:"city,omitempty"`
	County       sql.NullString `db:"county" json:"county,omitempty"`
	Postcode     sql.NullString `db:"postcode" json:"postcode,omitempty"`
	Country      string         `db:"country" json:"country"`
	IsDefault    bool           `db:"is_default" json:"is_default"`
	CreatedAt    time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time      `db:"updated_at" json:"updated_at"`
}

// RefreshToken stores refresh token data.
type RefreshToken struct {
	ID         uuid.UUID       `db:"id" json:"id"`
	UserID     uuid.UUID       `db:"user_id" json:"user_id"`
	TokenHash  string          `db:"token_hash" json:"-"`
	DeviceInfo json.RawMessage `db:"device_info" json:"device_info,omitempty"`
	IPAddress  sql.NullString  `db:"ip_address" json:"ip_address,omitempty"`
	ExpiresAt  time.Time       `db:"expires_at" json:"expires_at"`
	RevokedAt  *time.Time      `db:"revoked_at" json:"revoked_at,omitempty"`
	CreatedAt  time.Time       `db:"created_at" json:"created_at"`
}

// UserFavorite represents a user's favorited course.
type UserFavorite struct {
	UserID    uuid.UUID `db:"user_id" json:"user_id"`
	CourseID  uuid.UUID `db:"course_id" json:"course_id"`
	Source    string    `db:"source" json:"source"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

// --- Request / Response DTOs ---

type RegisterRequest struct {
	Email            string `json:"email" validate:"required,email,max=255"`
	Password         string `json:"password" validate:"required,min=8,max=128"`
	FirstName        string `json:"first_name" validate:"required,max=100"`
	LastName         string `json:"last_name" validate:"required,max=100"`
	Phone            string `json:"phone,omitempty" validate:"omitempty,max=20"`
	MarketingConsent bool   `json:"marketing_consent"`
}

type LoginRequest struct {
	Email      string          `json:"email" validate:"required,email"`
	Password   string          `json:"password" validate:"required"`
	DeviceInfo json.RawMessage `json:"device_info,omitempty"`
}

type AuthResponse struct {
	AccessToken               string `json:"access_token,omitempty"`
	RefreshToken              string `json:"refresh_token,omitempty"`
	ExpiresIn                 int64  `json:"expires_in,omitempty"`
	User                      *User  `json:"user,omitempty"`
	Requires2FA               bool   `json:"requires_2fa,omitempty"`
	UserID                    string `json:"user_id,omitempty"`
	Method                    string `json:"method,omitempty"`
	EmailVerificationRequired bool   `json:"email_verification_required,omitempty"`
}

type UpdateProfileRequest struct {
	FirstName                    string `json:"first_name,omitempty" validate:"omitempty,max=100"`
	LastName                     string `json:"last_name,omitempty" validate:"omitempty,max=100"`
	Phone                        string `json:"phone,omitempty" validate:"omitempty,max=20"`
	Occupation                   string `json:"occupation,omitempty" validate:"omitempty,max=100"`
	Employer                     string `json:"employer,omitempty" validate:"omitempty,max=255"`
	YearsExperience              *int   `json:"years_experience,omitempty"`
	EmergencyContactName         string `json:"emergency_contact_name,omitempty" validate:"omitempty,max=200"`
	EmergencyContactPhone        string `json:"emergency_contact_phone,omitempty" validate:"omitempty,max=20"`
	EmergencyContactRelationship string `json:"emergency_contact_relationship,omitempty" validate:"omitempty,max=50"`
}
