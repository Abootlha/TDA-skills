package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type AdminRepository struct {
	db *sqlx.DB
}

func NewAdminRepository(db *sqlx.DB) *AdminRepository {
	return &AdminRepository{db: db}
}

func (r *AdminRepository) Create(ctx context.Context, admin *models.Admin) error {
	query := `INSERT INTO admins (email, password_hash, first_name, last_name, role, permissions)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		admin.Email, admin.PasswordHash, admin.FirstName, admin.LastName, admin.Role, admin.Permissions,
	).Scan(&admin.ID, &admin.CreatedAt, &admin.UpdatedAt)
}

func (r *AdminRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Admin, error) {
	admin := &models.Admin{}
	err := r.db.GetContext(ctx, admin, "SELECT * FROM admins WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return admin, nil
}

func (r *AdminRepository) GetByEmail(ctx context.Context, email string) (*models.Admin, error) {
	admin := &models.Admin{}
	err := r.db.GetContext(ctx, admin, "SELECT * FROM admins WHERE email = $1 AND is_active = TRUE", email)
	if err != nil {
		return nil, err
	}
	return admin, nil
}

func (r *AdminRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE admins SET last_login=NOW(), login_attempts=0, updated_at=NOW() WHERE id=$1", id)
	return err
}

func (r *AdminRepository) CreateAuditLog(ctx context.Context, log *models.AdminAuditLog) error {
	query := `INSERT INTO admin_audit_logs (admin_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query,
		log.AdminID, log.Action, log.EntityType, log.EntityID,
		log.OldValue, log.NewValue, log.IPAddress, log.UserAgent,
	).Scan(&log.ID, &log.CreatedAt)
}

func (r *AdminRepository) GetDashboardStats(ctx context.Context) (*models.DashboardStats, error) {
	stats := &models.DashboardStats{}

	queries := map[string]string{
		"total_users":    "SELECT COUNT(*) FROM users",
		"total_bookings": "SELECT COUNT(*) FROM bookings",
		"total_revenue":  "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status='succeeded'",
		"revenue_today":  "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status='succeeded' AND created_at::date = CURRENT_DATE",
		"revenue_week":   "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status='succeeded' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)",
		"revenue_month":  "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status='succeeded' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)",
		"bookings_today": "SELECT COUNT(*) FROM bookings WHERE created_at::date = CURRENT_DATE",
		"bookings_week":  "SELECT COUNT(*) FROM bookings WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)",
		"pending":        "SELECT COUNT(*) FROM bookings WHERE status IN ('pending', 'pending_payment')",
		"active_courses": "SELECT COUNT(*) FROM courses WHERE is_active = TRUE",
	}

	r.db.GetContext(ctx, &stats.TotalUsers, queries["total_users"])
	r.db.GetContext(ctx, &stats.TotalBookings, queries["total_bookings"])
	r.db.GetContext(ctx, &stats.TotalRevenue, queries["total_revenue"])
	r.db.GetContext(ctx, &stats.RevenueToday, queries["revenue_today"])
	r.db.GetContext(ctx, &stats.RevenueThisWeek, queries["revenue_week"])
	r.db.GetContext(ctx, &stats.RevenueThisMonth, queries["revenue_month"])
	r.db.GetContext(ctx, &stats.BookingsToday, queries["bookings_today"])
	r.db.GetContext(ctx, &stats.BookingsThisWeek, queries["bookings_week"])
	r.db.GetContext(ctx, &stats.PendingBookings, queries["pending"])
	r.db.GetContext(ctx, &stats.ActiveCourses, queries["active_courses"])

	return stats, nil
}

// --- Settings ---

func (r *AdminRepository) GetSetting(ctx context.Context, key string) (*models.AdminSettings, error) {
	s := &models.AdminSettings{}
	err := r.db.GetContext(ctx, s, "SELECT * FROM admin_settings WHERE key=$1", key)
	if err != nil {
		return nil, err
	}
	return s, nil
}

func (r *AdminRepository) GetPublicSettings(ctx context.Context) ([]models.AdminSettings, error) {
	var settings []models.AdminSettings
	err := r.db.SelectContext(ctx, &settings, "SELECT * FROM admin_settings WHERE is_public=TRUE")
	return settings, err
}

func (r *AdminRepository) UpsertSetting(ctx context.Context, s *models.AdminSettings) error {
	query := `INSERT INTO admin_settings (key, value, description, is_public, updated_by)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, description=EXCLUDED.description,
		is_public=EXCLUDED.is_public, updated_by=EXCLUDED.updated_by, updated_at=NOW()
		RETURNING id, updated_at`
	return r.db.QueryRowContext(ctx, query,
		s.Key, s.Value, s.Description, s.IsPublic, s.UpdatedBy,
	).Scan(&s.ID, &s.UpdatedAt)
}
