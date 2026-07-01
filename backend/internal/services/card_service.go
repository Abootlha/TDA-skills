package services

import (
	"context"
	"errors"
	"strings"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

// CardService defines dynamic card administration and query behaviors
type CardService interface {
	CreateCard(ctx context.Context, req *CreateCardRequest) (*models.Card, error)
	ListCards(ctx context.Context, cardType string) ([]models.Card, error)
	ListAllCards(ctx context.Context) ([]models.Card, error)
	GetCardByID(ctx context.Context, id string) (*models.Card, error)
	GetCardBySlug(ctx context.Context, slug string) (*models.Card, error)
	UpdateCard(ctx context.Context, id string, req *UpdateCardRequest) (*models.Card, error)
	DeleteCard(ctx context.Context, id string) error
}

type cardService struct {
	repo repository.CardRepository
}

// NewCardService instantiates a new CardService
func NewCardService(repo repository.CardRepository) CardService {
	return &cardService{repo: repo}
}

// CreateCardRequest parameters mapping
type CreateCardRequest struct {
	Title       string  `json:"title"`
	Badge       string  `json:"badge"`
	BadgeClass  string  `json:"badge_class"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Price       float64 `json:"price"`
	Slug        string  `json:"slug"`
	Type        string  `json:"type"`
	IsActive    bool    `json:"is_active"`
}

// UpdateCardRequest parameters mapping
type UpdateCardRequest struct {
	Title       string  `json:"title"`
	Badge       string  `json:"badge"`
	BadgeClass  string  `json:"badge_class"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Price       float64 `json:"price"`
	Slug        string  `json:"slug"`
	Type        string  `json:"type"`
	IsActive    bool    `json:"is_active"`
}

func (s *cardService) CreateCard(ctx context.Context, req *CreateCardRequest) (*models.Card, error) {
	req.Title = strings.TrimSpace(req.Title)
	req.Slug = strings.TrimSpace(strings.ToLower(req.Slug))
	req.Type = strings.TrimSpace(strings.ToLower(req.Type))

	if req.Title == "" {
		return nil, errors.New("title is required")
	}
	if req.Slug == "" {
		return nil, errors.New("slug is required")
	}
	if req.Type != "cscs" && req.Type != "cpcs" {
		return nil, errors.New("invalid card type; must be cscs or cpcs")
	}
	if req.Price <= 0 {
		return nil, errors.New("price must be greater than 0")
	}

	card := &models.Card{
		Title:       req.Title,
		Badge:       req.Badge,
		BadgeClass:  req.BadgeClass,
		Description: req.Description,
		Image:       req.Image,
		Price:       req.Price,
		Slug:        req.Slug,
		Type:        req.Type,
		IsActive:    req.IsActive,
	}

	if err := s.repo.Create(ctx, card); err != nil {
		return nil, err
	}

	return card, nil
}

func (s *cardService) ListCards(ctx context.Context, cardType string) ([]models.Card, error) {
	return s.repo.List(ctx, cardType)
}

func (s *cardService) ListAllCards(ctx context.Context) ([]models.Card, error) {
	return s.repo.ListAll(ctx)
}

func (s *cardService) GetCardByID(ctx context.Context, id string) (*models.Card, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *cardService) GetCardBySlug(ctx context.Context, slug string) (*models.Card, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *cardService) UpdateCard(ctx context.Context, id string, req *UpdateCardRequest) (*models.Card, error) {
	card, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	req.Title = strings.TrimSpace(req.Title)
	req.Slug = strings.TrimSpace(strings.ToLower(req.Slug))
	req.Type = strings.TrimSpace(strings.ToLower(req.Type))

	if req.Title == "" {
		return nil, errors.New("title is required")
	}
	if req.Slug == "" {
		return nil, errors.New("slug is required")
	}
	if req.Type != "cscs" && req.Type != "cpcs" {
		return nil, errors.New("invalid card type; must be cscs or cpcs")
	}
	if req.Price <= 0 {
		return nil, errors.New("price must be greater than 0")
	}

	card.Title = req.Title
	card.Badge = req.Badge
	card.BadgeClass = req.BadgeClass
	card.Description = req.Description
	card.Image = req.Image
	card.Price = req.Price
	card.Slug = req.Slug
	card.Type = req.Type
	card.IsActive = req.IsActive

	if err := s.repo.Update(ctx, card); err != nil {
		return nil, err
	}

	return card, nil
}

func (s *cardService) DeleteCard(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
