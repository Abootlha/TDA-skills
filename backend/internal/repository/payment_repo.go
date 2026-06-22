package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type PaymentRepository struct {
	db *sqlx.DB
}

func NewPaymentRepository(db *sqlx.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(ctx context.Context, p *models.Payment) error {
	query := `INSERT INTO payments (booking_id, user_id, payment_number, stripe_payment_intent_id,
		paypal_order_id, paypal_capture_id, amount, currency, status, metadata)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		p.BookingID, p.UserID, p.PaymentNumber, p.StripePaymentIntentID,
		p.PayPalOrderID, p.PayPalCaptureID, p.Amount, p.Currency, p.Status, p.Metadata,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

func (r *PaymentRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Payment, error) {
	p := &models.Payment{}
	err := r.db.GetContext(ctx, p, "SELECT * FROM payments WHERE id=$1", id)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *PaymentRepository) GetByPaymentIntentID(ctx context.Context, piID string) (*models.Payment, error) {
	p := &models.Payment{}
	err := r.db.GetContext(ctx, p, "SELECT * FROM payments WHERE stripe_payment_intent_id=$1", piID)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *PaymentRepository) GetByPayPalOrderID(ctx context.Context, orderID string) (*models.Payment, error) {
	p := &models.Payment{}
	err := r.db.GetContext(ctx, p, "SELECT * FROM payments WHERE paypal_order_id=$1", orderID)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *PaymentRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE payments SET status=$1, updated_at=NOW() WHERE id=$2", status, id)
	return err
}

func (r *PaymentRepository) UpdateStatusByBookingID(ctx context.Context, bookingID uuid.UUID, status, code, message string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE payments SET status=$1, failure_code=$2, failure_message=$3, updated_at=NOW() WHERE booking_id=$4 AND status='pending'", status, code, message, bookingID)
	return err
}

func (r *PaymentRepository) UpdateStripeDetails(ctx context.Context, id uuid.UUID, chargeID, method, brand, last4 string, receiptURL string) error {
	query := `UPDATE payments SET stripe_charge_id=$1, payment_method=$2, card_brand=$3, card_last4=$4,
		receipt_url=$5, updated_at=NOW() WHERE id=$6`
	_, err := r.db.ExecContext(ctx, query, chargeID, method, brand, last4, receiptURL, id)
	return err
}

func (r *PaymentRepository) UpdatePayPalCapture(ctx context.Context, id uuid.UUID, captureID string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE payments SET paypal_capture_id=$1, status='succeeded', updated_at=NOW() WHERE id=$2", captureID, id)
	return err
}

func (r *PaymentRepository) SetRefunded(ctx context.Context, id uuid.UUID, amount float64, reason string) error {
	query := `UPDATE payments SET status='refunded', refunded_amount=$1, refund_reason=$2, refunded_at=NOW(), updated_at=NOW() WHERE id=$3`
	_, err := r.db.ExecContext(ctx, query, amount, reason, id)
	return err
}

func (r *PaymentRepository) SetFailed(ctx context.Context, id uuid.UUID, code, message string) error {
	query := `UPDATE payments SET status='failed', failure_code=$1, failure_message=$2, updated_at=NOW() WHERE id=$3`
	_, err := r.db.ExecContext(ctx, query, code, message, id)
	return err
}

func (r *PaymentRepository) List(ctx context.Context, params models.PaymentListParams) ([]models.Payment, int64, error) {
	var total int64
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 20
	}
	offset := (params.Page - 1) * params.Limit

	where := "1=1"
	args := []interface{}{}
	idx := 1

	if params.Status != "" {
		where += fmt.Sprintf(" AND status=$%d", idx)
		args = append(args, params.Status)
		idx++
	}
	if params.UserID != "" {
		where += fmt.Sprintf(" AND user_id=$%d", idx)
		args = append(args, params.UserID)
		idx++
	}

	countArgs := make([]interface{}, len(args))
	copy(countArgs, args)
	r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM payments WHERE "+where, countArgs...)

	query := fmt.Sprintf("SELECT * FROM payments WHERE %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d",
		where, idx, idx+1)
	args = append(args, params.Limit, offset)

	var payments []models.Payment
	err := r.db.SelectContext(ctx, &payments, query, args...)
	return payments, total, err
}

func (r *PaymentRepository) GetNextPaymentNumber(ctx context.Context) (string, error) {
	var count int64
	r.db.GetContext(ctx, &count, "SELECT COUNT(*) FROM payments")
	return fmt.Sprintf("PAY-2024-%06d", count+1), nil
}
