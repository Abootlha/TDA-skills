package repository

import (
	"context"
	"github.com/jmoiron/sqlx"
	"github.com/tdaskills/backend/internal/models"
)

type EnquiryRepository interface {
	Create(enquiry *models.Enquiry) error
	List(ctx context.Context, limit, offset int) ([]models.Enquiry, int, error)
	GetByID(ctx context.Context, id string) (*models.Enquiry, error)
	UpdateStatus(ctx context.Context, id, status string) error
	Delete(ctx context.Context, id string) error
}

type enquiryRepository struct {
	db *sqlx.DB
}

func NewEnquiryRepository(db *sqlx.DB) EnquiryRepository {
	return &enquiryRepository{db: db}
}

func (r *enquiryRepository) Create(enquiry *models.Enquiry) error {
	query := `
		INSERT INTO enquiries (full_name, email, phone_number, enquiry_type, message)
		VALUES (:full_name, :email, :phone_number, :enquiry_type, :message)
		RETURNING id, status, created_at, updated_at
	`
	rows, err := r.db.NamedQuery(query, enquiry)
	if err != nil {
		return err
	}
	defer rows.Close()

	if rows.Next() {
		return rows.StructScan(enquiry)
	}
	return nil
}

func (r *enquiryRepository) List(ctx context.Context, limit, offset int) ([]models.Enquiry, int, error) {
	var enquiries []models.Enquiry
	var total int

	err := r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM enquiries")
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT id, full_name, email, phone_number, enquiry_type, message, status, created_at, updated_at 
		FROM enquiries 
		ORDER BY created_at DESC 
		LIMIT $1 OFFSET $2
	`
	err = r.db.SelectContext(ctx, &enquiries, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	return enquiries, total, nil
}

func (r *enquiryRepository) GetByID(ctx context.Context, id string) (*models.Enquiry, error) {
	var enquiry models.Enquiry
	err := r.db.GetContext(ctx, &enquiry, "SELECT * FROM enquiries WHERE id = $1", id)
	return &enquiry, err
}

func (r *enquiryRepository) UpdateStatus(ctx context.Context, id, status string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE enquiries SET status = $1, updated_at = NOW() WHERE id = $2", status, id)
	return err
}

func (r *enquiryRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM enquiries WHERE id = $1", id)
	return err
}
