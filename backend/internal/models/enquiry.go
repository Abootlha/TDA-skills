package models

import (
	"time"
)

// Enquiry represents a contact form submission
type Enquiry struct {
	ID          string    `json:"id" db:"id"`
	FullName    string    `json:"full_name" db:"full_name" validate:"required,min=2,max=100"`
	Email       string    `json:"email" db:"email" validate:"required,email"`
	PhoneNumber string    `json:"phone_number" db:"phone_number" validate:"required"`
	EnquiryType string    `json:"enquiry_type" db:"enquiry_type"`
	Message     string    `json:"message" db:"message"`
	Status      string    `json:"status" db:"status"` // e.g. "new", "in_progress", "resolved"
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
