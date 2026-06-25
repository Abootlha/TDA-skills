package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// Admin represents an admin account with role-based permissions.
type Admin struct {
	ID            uuid.UUID       `db:"id" json:"id"`
	Email         string          `db:"email" json:"email"`
	PasswordHash  string          `db:"password_hash" json:"-"`
	FirstName     string          `db:"first_name" json:"first_name"`
	LastName      string          `db:"last_name" json:"last_name"`
	Role          string          `db:"role" json:"role"`
	Permissions   json.RawMessage `db:"permissions" json:"permissions"`
	AvatarURL     sql.NullString  `db:"avatar_url" json:"avatar_url,omitempty"`
	IsActive      bool            `db:"is_active" json:"is_active"`
	LastLogin     *time.Time      `db:"last_login" json:"last_login,omitempty"`
	LoginAttempts int             `db:"login_attempts" json:"-"`
	LockedUntil   *time.Time      `db:"locked_until" json:"-"`
	MagicURL      sql.NullString  `db:"magic_url" json:"-"`
	TinyURL       sql.NullString  `db:"tiny_url" json:"-"`
	CreatedAt     time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt     time.Time       `db:"updated_at" json:"updated_at"`
}

// AdminAuditLog records admin actions for compliance.
type AdminAuditLog struct {
	ID         uuid.UUID       `db:"id" json:"id"`
	AdminID    *uuid.UUID      `db:"admin_id" json:"admin_id,omitempty"`
	SessionID  *uuid.UUID      `db:"session_id" json:"session_id,omitempty"`
	Action     string          `db:"action" json:"action"`
	EntityType string          `db:"entity_type" json:"entity_type"`
	EntityID   *uuid.UUID      `db:"entity_id" json:"entity_id,omitempty"`
	OldValue   json.RawMessage `db:"old_value" json:"old_value,omitempty"`
	NewValue   json.RawMessage `db:"new_value" json:"new_value,omitempty"`
	IPAddress  sql.NullString  `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent  sql.NullString  `db:"user_agent" json:"user_agent,omitempty"`
	CreatedAt  time.Time       `db:"created_at" json:"created_at"`
}

// AdminSession represents an active admin login session (1-hour expiry).
type AdminSession struct {
	ID            uuid.UUID       `db:"id" json:"id"`
	AdminID       uuid.UUID       `db:"admin_id" json:"admin_id"`
	TokenHash     string          `db:"token_hash" json:"-"`
	IPAddress     sql.NullString  `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent     sql.NullString  `db:"user_agent" json:"user_agent,omitempty"`
	DeviceInfo    json.RawMessage `db:"device_info" json:"device_info,omitempty"`
	CreatedAt     time.Time       `db:"created_at" json:"created_at"`
	ExpiresAt     time.Time       `db:"expires_at" json:"expires_at"`
	RevokedAt     *time.Time      `db:"revoked_at" json:"revoked_at,omitempty"`
	LastActivity  time.Time       `db:"last_activity" json:"last_activity"`
}

// AdminSettings represents a key-value site setting.
type AdminSettings struct {
	ID          uuid.UUID       `db:"id" json:"id"`
	Key         string          `db:"key" json:"key"`
	Value       json.RawMessage `db:"value" json:"value"`
	Description sql.NullString  `db:"description" json:"description,omitempty"`
	IsPublic    bool            `db:"is_public" json:"is_public"`
	UpdatedBy   *uuid.UUID      `db:"updated_by" json:"updated_by,omitempty"`
	UpdatedAt   time.Time       `db:"updated_at" json:"updated_at"`
}

// --- Request DTOs ---

type AdminLoginRequest struct {
	Email      string          `json:"email" binding:"required,email"`
	Password   string          `json:"password" binding:"required"`
	MagicKey   string          `json:"magic_key" binding:"required"`
	DeviceInfo json.RawMessage `json:"device_info,omitempty"`
}

type AdminAuthResponse struct {
	AccessToken      string     `json:"access_token"`
	RefreshToken     string     `json:"refresh_token,omitempty"`
	ExpiresIn        int64      `json:"expires_in"`
	SessionExpiresAt *time.Time `json:"session_expires_at,omitempty"`
	Requires2FA      bool       `json:"requires_2fa,omitempty"`
	Admin            *Admin     `json:"admin"`
}

type UpdateUserRoleRequest struct {
	IsActive *bool  `json:"is_active,omitempty"`
	IsLocked *bool  `json:"is_locked,omitempty"`
}

type UpdateSettingRequest struct {
	Value       json.RawMessage `json:"value" validate:"required"`
	Description string          `json:"description,omitempty"`
	IsPublic    *bool           `json:"is_public,omitempty"`
}

// DashboardStats holds aggregate statistics for the admin dashboard.
type DashboardStats struct {
	TotalUsers       int64   `json:"total_users"`
	TotalBookings    int64   `json:"total_bookings"`
	TotalRevenue     float64 `json:"total_revenue"`
	RevenueToday     float64 `json:"revenue_today"`
	RevenueThisWeek  float64 `json:"revenue_this_week"`
	RevenueThisMonth float64 `json:"revenue_this_month"`
	BookingsToday    int64   `json:"bookings_today"`
	BookingsThisWeek int64   `json:"bookings_this_week"`
	PendingBookings  int64   `json:"pending_bookings"`
	ActiveCourses    int64   `json:"active_courses"`
}
