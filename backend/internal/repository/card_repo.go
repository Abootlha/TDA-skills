package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/tdaskills/backend/internal/models"
)

// CardRepository defines operations on the cards table
type CardRepository interface {
	Create(ctx context.Context, card *models.Card) error
	List(ctx context.Context, cardType string) ([]models.Card, error)
	ListAll(ctx context.Context) ([]models.Card, error)
	GetByID(ctx context.Context, id string) (*models.Card, error)
	GetBySlug(ctx context.Context, slug string) (*models.Card, error)
	Update(ctx context.Context, card *models.Card) error
	Delete(ctx context.Context, id string) error
}

type cardRepository struct {
	db *sqlx.DB
}

// NewCardRepository instantiates a new CardRepository
func NewCardRepository(db *sqlx.DB) CardRepository {
	return &cardRepository{db: db}
}

func (r *cardRepository) Create(ctx context.Context, card *models.Card) error {
	query := `
		INSERT INTO cards (title, badge, badge_class, description, image, price, slug, type, is_active)
		VALUES (:title, :badge, :badge_class, :description, :image, :price, :slug, :type, :is_active)
		RETURNING id, created_at, updated_at
	`
	rows, err := r.db.NamedQueryContext(ctx, query, card)
	if err != nil {
		return err
	}
	defer rows.Close()

	if rows.Next() {
		return rows.StructScan(card)
	}
	return nil
}

func (r *cardRepository) List(ctx context.Context, cardType string) ([]models.Card, error) {
	var cards []models.Card
	var err error
	if cardType != "" {
		err = r.db.SelectContext(ctx, &cards, "SELECT * FROM cards WHERE type = $1 AND is_active = TRUE ORDER BY created_at DESC", cardType)
	} else {
		err = r.db.SelectContext(ctx, &cards, "SELECT * FROM cards WHERE is_active = TRUE ORDER BY created_at DESC")
	}
	return cards, err
}

func (r *cardRepository) ListAll(ctx context.Context) ([]models.Card, error) {
	var cards []models.Card
	err := r.db.SelectContext(ctx, &cards, "SELECT * FROM cards ORDER BY created_at DESC")
	return cards, err
}

func (r *cardRepository) GetByID(ctx context.Context, id string) (*models.Card, error) {
	var card models.Card
	err := r.db.GetContext(ctx, &card, "SELECT * FROM cards WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &card, nil
}

func (r *cardRepository) GetBySlug(ctx context.Context, slug string) (*models.Card, error) {
	var card models.Card
	err := r.db.GetContext(ctx, &card, "SELECT * FROM cards WHERE slug = $1 AND is_active = TRUE", slug)
	if err != nil {
		return nil, err
	}
	return &card, nil
}

func (r *cardRepository) Update(ctx context.Context, card *models.Card) error {
	query := `
		UPDATE cards
		SET title = :title, badge = :badge, badge_class = :badge_class, description = :description,
		    image = :image, price = :price, slug = :slug, type = :type, is_active = :is_active, updated_at = NOW()
		WHERE id = :id
	`
	_, err := r.db.NamedExecContext(ctx, query, card)
	return err
}

func (r *cardRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM cards WHERE id = $1", id)
	return err
}
