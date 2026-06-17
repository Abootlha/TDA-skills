package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type BookingRepository struct {
	db *sqlx.DB
}

func NewBookingRepository(db *sqlx.DB) *BookingRepository {
	return &BookingRepository{db: db}
}

func (r *BookingRepository) Create(ctx context.Context, b *models.Booking) error {
	query := `INSERT INTO bookings (user_id, booking_number, status, booking_type, personal_details,
		company_details, test_details, card_details, nvq_details, source, referral_code, notes, total_amount,
		discount_amount, tax_amount, currency, created_by)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		b.UserID, b.BookingNumber, b.Status, b.BookingType, b.PersonalDetails,
		b.CompanyDetails, b.TestDetails, b.CardDetails, b.NVQDetails, b.Source, b.ReferralCode,
		b.Notes, b.TotalAmount, b.DiscountAmount, b.TaxAmount, b.Currency, b.CreatedBy,
	).Scan(&b.ID, &b.CreatedAt, &b.UpdatedAt)
}

func (r *BookingRepository) CreateItem(ctx context.Context, item *models.BookingItem) error {
	query := `INSERT INTO booking_items (booking_id, course_id, description, unit_price, quantity, discount)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query,
		item.BookingID, item.CourseID, item.Description, item.UnitPrice, item.Quantity, item.Discount,
	).Scan(&item.ID, &item.CreatedAt)
}

func (r *BookingRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Booking, error) {
	b := &models.Booking{}
	err := r.db.GetContext(ctx, b, "SELECT * FROM bookings WHERE id=$1", id)
	if err != nil {
		return nil, err
	}
	err = r.db.SelectContext(ctx, &b.Items, "SELECT * FROM booking_items WHERE booking_id=$1", id)
	return b, err
}

func (r *BookingRepository) GetByBookingNumber(ctx context.Context, number string) (*models.Booking, error) {
	b := &models.Booking{}
	err := r.db.GetContext(ctx, b, "SELECT * FROM bookings WHERE booking_number=$1", number)
	if err != nil {
		return nil, err
	}
	err = r.db.SelectContext(ctx, &b.Items, "SELECT * FROM booking_items WHERE booking_id=$1", b.ID)
	return b, err
}

func (r *BookingRepository) ListByUser(ctx context.Context, userID uuid.UUID, page, limit int) ([]models.Booking, int64, error) {
	var total int64
	offset := (page - 1) * limit

	r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM bookings WHERE user_id=$1", userID)

	var bookings []models.Booking
	err := r.db.SelectContext(ctx, &bookings,
		"SELECT * FROM bookings WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
		userID, limit, offset)
	return bookings, total, err
}

func (r *BookingRepository) List(ctx context.Context, params models.BookingListParams) ([]models.Booking, int64, error) {
	var total int64
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 20
	}
	offset := (params.Page - 1) * params.Limit

	where := []string{"1=1"}
	args := []interface{}{}
	idx := 1

	if params.Status != "" {
		where = append(where, fmt.Sprintf("status=$%d", idx))
		args = append(args, params.Status)
		idx++
	}
	if params.BookingType != "" {
		where = append(where, fmt.Sprintf("booking_type=$%d", idx))
		args = append(args, params.BookingType)
		idx++
	}
	if params.UserID != "" {
		where = append(where, fmt.Sprintf("user_id=$%d", idx))
		args = append(args, params.UserID)
		idx++
	}
	if params.Search != "" {
		where = append(where, fmt.Sprintf("booking_number ILIKE $%d", idx))
		args = append(args, "%"+params.Search+"%")
		idx++
	}

	whereClause := strings.Join(where, " AND ")
	countArgs := make([]interface{}, len(args))
	copy(countArgs, args)
	r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM bookings WHERE "+whereClause, countArgs...)

	query := fmt.Sprintf("SELECT * FROM bookings WHERE %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d",
		whereClause, idx, idx+1)
	args = append(args, params.Limit, offset)

	var bookings []models.Booking
	err := r.db.SelectContext(ctx, &bookings, query, args...)
	return bookings, total, err
}

func (r *BookingRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := "UPDATE bookings SET status=$1, updated_at=NOW()"
	switch status {
	case "confirmed":
		query += ", confirmed_at=NOW()"
	case "completed":
		query += ", completed_at=NOW()"
	case "cancelled":
		query += ", cancelled_at=NOW()"
	}
	query += " WHERE id=$2"
	_, err := r.db.ExecContext(ctx, query, status, id)
	return err
}

func (r *BookingRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM bookings WHERE id=$1", id)
	return err
}

func (r *BookingRepository) GetNextBookingNumber(ctx context.Context) (string, error) {
	var count int64
	r.db.GetContext(ctx, &count, "SELECT COUNT(*) FROM bookings")
	return fmt.Sprintf("BK-2024-%06d", count+1), nil
}
