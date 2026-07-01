package models

import (
	"time"
)

// Card represents a dynamic physical card (CSCS or CPCS)
type Card struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title" validate:"required,min=2"`
	Badge       string    `json:"badge" db:"badge"`
	BadgeClass  string    `json:"badge_class" db:"badge_class"`
	Description string    `json:"description" db:"description"`
	Image       string    `json:"image" db:"image"`
	Price       float64   `json:"price" db:"price" validate:"required,gt=0"`
	Slug        string    `json:"slug" db:"slug" validate:"required"`
	Type        string    `json:"type" db:"type" validate:"required,oneof=cscs cpcs"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
