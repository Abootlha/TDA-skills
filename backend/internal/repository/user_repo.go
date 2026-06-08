package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"

	"github.com/tdaskills/backend/internal/models"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	query := `INSERT INTO users (email, password_hash, first_name, last_name, phone)
		VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		user.Email, user.PasswordHash, user.FirstName, user.LastName, user.Phone,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	user := &models.User{}
	err := r.db.GetContext(ctx, user, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	user := &models.User{}
	err := r.db.GetContext(ctx, user, "SELECT * FROM users WHERE email = $1", email)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) Update(ctx context.Context, user *models.User) error {
	query := `UPDATE users SET first_name=$1, last_name=$2, phone=$3, avatar_url=$4, updated_at=NOW()
		WHERE id=$5`
	_, err := r.db.ExecContext(ctx, query, user.FirstName, user.LastName, user.Phone, user.AvatarURL, user.ID)
	return err
}

func (r *UserRepository) UpdateLoginAttempts(ctx context.Context, id uuid.UUID, attempts int, lockedUntil *time.Time) error {
	query := `UPDATE users SET login_attempts=$1, locked_until=$2, updated_at=NOW() WHERE id=$3`
	_, err := r.db.ExecContext(ctx, query, attempts, lockedUntil, id)
	return err
}

func (r *UserRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE users SET last_login=NOW(), login_attempts=0, updated_at=NOW() WHERE id=$1", id)
	return err
}

func (r *UserRepository) SetEmailVerified(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE users SET email_verified=TRUE, email_verification_token=NULL, updated_at=NOW() WHERE id=$1", id)
	return err
}

func (r *UserRepository) List(ctx context.Context, page, limit int, search string) ([]models.User, int64, error) {
	var total int64
	offset := (page - 1) * limit

	countQuery := "SELECT COUNT(*) FROM users WHERE 1=1"
	listQuery := "SELECT * FROM users WHERE 1=1"

	args := []interface{}{}
	argIdx := 1

	if search != "" {
		searchClause := fmt.Sprintf(" AND (email ILIKE $%d OR first_name ILIKE $%d OR last_name ILIKE $%d)", argIdx, argIdx, argIdx)
		countQuery += searchClause
		listQuery += searchClause
		args = append(args, "%"+search+"%")
		argIdx++
	}

	// Count
	err := r.db.GetContext(ctx, &total, countQuery, args...)
	if err != nil {
		return nil, 0, err
	}

	listQuery += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIdx, argIdx+1)
	args = append(args, limit, offset)

	var users []models.User
	err = r.db.SelectContext(ctx, &users, listQuery, args...)
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (r *UserRepository) UpdateStatus(ctx context.Context, id uuid.UUID, isActive, isLocked bool) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE users SET is_active=$1, is_locked=$2, updated_at=NOW() WHERE id=$3",
		isActive, isLocked, id)
	return err
}

// --- Refresh Tokens ---

func (r *UserRepository) CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error {
	query := `INSERT INTO refresh_tokens (user_id, token_hash, device_info, expires_at)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query,
		token.UserID, token.TokenHash, token.DeviceInfo, token.ExpiresAt,
	).Scan(&token.ID, &token.CreatedAt)
}

func (r *UserRepository) GetRefreshToken(ctx context.Context, tokenHash string) (*models.RefreshToken, error) {
	t := &models.RefreshToken{}
	err := r.db.GetContext(ctx, t,
		"SELECT * FROM refresh_tokens WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at > NOW()", tokenHash)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (r *UserRepository) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE refresh_tokens SET revoked_at=NOW() WHERE token_hash=$1", tokenHash)
	return err
}

func (r *UserRepository) RevokeAllUserTokens(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE refresh_tokens SET revoked_at=NOW() WHERE user_id=$1 AND revoked_at IS NULL", userID)
	return err
}

// --- Profile ---

func (r *UserRepository) GetProfile(ctx context.Context, userID uuid.UUID) (*models.UserProfile, error) {
	p := &models.UserProfile{}
	err := r.db.GetContext(ctx, p, "SELECT * FROM user_profiles WHERE user_id=$1", userID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return p, err
}

func (r *UserRepository) UpsertProfile(ctx context.Context, p *models.UserProfile) error {
	query := `INSERT INTO user_profiles (user_id, occupation, employer, years_experience,
		emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
		marketing_consent, sms_notifications, email_notifications)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (user_id) DO UPDATE SET
		occupation=EXCLUDED.occupation, employer=EXCLUDED.employer,
		years_experience=EXCLUDED.years_experience,
		emergency_contact_name=EXCLUDED.emergency_contact_name,
		emergency_contact_phone=EXCLUDED.emergency_contact_phone,
		emergency_contact_relationship=EXCLUDED.emergency_contact_relationship,
		marketing_consent=EXCLUDED.marketing_consent,
		sms_notifications=EXCLUDED.sms_notifications,
		email_notifications=EXCLUDED.email_notifications,
		updated_at=NOW()
		RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		p.UserID, p.Occupation, p.Employer, p.YearsExperience,
		p.EmergencyContactName, p.EmergencyContactPhone, p.EmergencyContactRelationship,
		p.MarketingConsent, p.SMSNotifications, p.EmailNotifications,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

// --- Address ---

func (r *UserRepository) GetAddress(ctx context.Context, userID uuid.UUID) (*models.UserAddress, error) {
	a := &models.UserAddress{}
	err := r.db.GetContext(ctx, a, "SELECT * FROM user_addresses WHERE user_id=$1", userID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return a, err
}

func (r *UserRepository) UpsertAddress(ctx context.Context, a *models.UserAddress) error {
	query := `INSERT INTO user_addresses (user_id, address_line1, address_line2, city, county, postcode, country)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (user_id) DO UPDATE SET
		address_line1=EXCLUDED.address_line1, address_line2=EXCLUDED.address_line2,
		city=EXCLUDED.city, county=EXCLUDED.county, postcode=EXCLUDED.postcode,
		country=EXCLUDED.country, updated_at=NOW()
		RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		a.UserID, a.AddressLine1, a.AddressLine2, a.City, a.County, a.Postcode, a.Country,
	).Scan(&a.ID, &a.CreatedAt, &a.UpdatedAt)
}

// --- User Sessions & 2FA ---

func (r *UserRepository) CreateUserSession(ctx context.Context, session *models.UserSession) error {
	query := `INSERT INTO user_sessions (user_id, token_hash, ip_address, user_agent, device_info, two_factor_verified, expires_at, last_activity)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query,
		session.UserID, session.TokenHash, session.IPAddress, session.UserAgent, session.DeviceInfo, session.TwoFactorVerified, session.ExpiresAt,
	).Scan(&session.ID, &session.CreatedAt)
}

func (r *UserRepository) GetUserSessions(ctx context.Context, userID uuid.UUID) ([]models.UserSession, error) {
	var sessions []models.UserSession
	query := `SELECT * FROM user_sessions WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW() ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &sessions, query, userID)
	return sessions, err
}

func (r *UserRepository) RevokeSession(ctx context.Context, userID uuid.UUID, sessionID uuid.UUID) error {
	var tokenHash string
	err := r.db.GetContext(ctx, &tokenHash, "SELECT token_hash FROM user_sessions WHERE id = $1 AND user_id = $2", sessionID, userID)
	if err == nil && tokenHash != "" {
		r.db.ExecContext(ctx, "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1", tokenHash)
	}
	_, err = r.db.ExecContext(ctx, "UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1 AND user_id = $2", sessionID, userID)
	return err
}

func (r *UserRepository) RevokeAllSessions(ctx context.Context, userID uuid.UUID) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, "UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL", userID)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL", userID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *UserRepository) GetTwoFactorSecret(ctx context.Context, userID uuid.UUID) (*models.TwoFactorSecret, error) {
	secret := &models.TwoFactorSecret{}
	err := r.db.GetContext(ctx, secret, "SELECT * FROM two_factor_secrets WHERE user_id = $1", userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return secret, nil
}

func (r *UserRepository) UpsertTwoFactorSecret(ctx context.Context, userID uuid.UUID, secret string, backupCodes json.RawMessage) error {
	query := `INSERT INTO two_factor_secrets (user_id, secret, backup_codes, is_enabled)
		VALUES ($1, $2, $3, FALSE)
		ON CONFLICT (user_id) DO UPDATE SET secret = EXCLUDED.secret, backup_codes = EXCLUDED.backup_codes, is_enabled = FALSE, updated_at = NOW()`
	_, err := r.db.ExecContext(ctx, query, userID, secret, backupCodes)
	return err
}

func (r *UserRepository) EnableTwoFactor(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE two_factor_secrets SET is_enabled = TRUE, updated_at = NOW() WHERE user_id = $1", userID)
	return err
}

func (r *UserRepository) DisableTwoFactor(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE two_factor_secrets SET is_enabled = FALSE, updated_at = NOW() WHERE user_id = $1", userID)
	return err
}

func (r *UserRepository) UpdatePassword(ctx context.Context, userID uuid.UUID, newPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), 12)
	if err != nil {
		return err
	}
	_, err = r.db.ExecContext(ctx, "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", string(hash), userID)
	return err
}
