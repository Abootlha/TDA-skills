package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/tdaskills/backend/internal/models"
)

type ContactRepository interface {
	Create(contact *models.Contact) error
	List(ctx context.Context, limit, offset int) ([]models.Contact, int, error)
	GetByID(ctx context.Context, id string) (*models.Contact, error)
	UpdateStatus(ctx context.Context, id, status string) error
	Delete(ctx context.Context, id string) error
}

type contactRepository struct {
	db *sqlx.DB
}

func NewContactRepository(db *sqlx.DB) ContactRepository {
	return &contactRepository{db: db}
}

func (r *contactRepository) Create(contact *models.Contact) error {
	query := `
		INSERT INTO contacts (full_name, email, phone_number, enquiry_type, message, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
		VALUES (:full_name, :email, :phone_number, :enquiry_type, :message, :utm_source, :utm_medium, :utm_campaign, :utm_term, :utm_content)
		RETURNING id, status, created_at, updated_at
	`
	rows, err := r.db.NamedQuery(query, contact)
	if err != nil {
		return err
	}
	defer rows.Close()

	if rows.Next() {
		return rows.StructScan(contact)
	}
	return nil
}

func (r *contactRepository) List(ctx context.Context, limit, offset int) ([]models.Contact, int, error) {
	var contacts []models.Contact
	var total int

	err := r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM contacts")
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT id, full_name, email, phone_number, enquiry_type, message, status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, created_at, updated_at 
		FROM contacts 
		ORDER BY created_at DESC 
		LIMIT $1 OFFSET $2
	`
	err = r.db.SelectContext(ctx, &contacts, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	return contacts, total, nil
}

func (r *contactRepository) GetByID(ctx context.Context, id string) (*models.Contact, error) {
	var contact models.Contact
	err := r.db.GetContext(ctx, &contact, "SELECT * FROM contacts WHERE id = $1", id)
	return &contact, err
}

func (r *contactRepository) UpdateStatus(ctx context.Context, id, status string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE contacts SET status = $1, updated_at = NOW() WHERE id = $2", status, id)
	return err
}

func (r *contactRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM contacts WHERE id = $1", id)
	return err
}
