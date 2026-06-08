package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type NotificationRepository struct {
	db *sqlx.DB
}

func NewNotificationRepository(db *sqlx.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) Create(ctx context.Context, n *models.Notification) error {
	query := `INSERT INTO notifications (user_id, type, channel, title, message, data)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query,
		n.UserID, n.Type, n.Channel, n.Title, n.Message, n.Data,
	).Scan(&n.ID, &n.CreatedAt)
}

func (r *NotificationRepository) GetByUser(ctx context.Context, userID uuid.UUID, page, limit int) ([]models.Notification, int64, error) {
	var total int64
	offset := (page - 1) * limit

	r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM notifications WHERE user_id=$1", userID)

	var notifs []models.Notification
	err := r.db.SelectContext(ctx, &notifs,
		"SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
		userID, limit, offset)
	return notifs, total, err
}

func (r *NotificationRepository) GetUnreadCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.GetContext(ctx, &count, "SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=FALSE", userID)
	return count, err
}

func (r *NotificationRepository) MarkAsRead(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE notifications SET is_read=TRUE, read_at=NOW() WHERE id=$1", id)
	return err
}

func (r *NotificationRepository) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE notifications SET is_read=TRUE, read_at=NOW() WHERE user_id=$1 AND is_read=FALSE", userID)
	return err
}

func (r *NotificationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM notifications WHERE id=$1", id)
	return err
}

