package models

import (
	"time"
)

// Contact represents a contact form submission
type Contact struct {
	ID          string    `json:"id" db:"id"`
	FullName    string    `json:"full_name" db:"full_name" validate:"required,min=2,max=100"`
	Email       string    `json:"email" db:"email" validate:"required,email"`
	PhoneNumber string    `json:"phone_number" db:"phone_number" validate:"required"`
	EnquiryType string    `json:"enquiry_type" db:"enquiry_type"`
	Message     string    `json:"message" db:"message"`
	Status      string    `json:"status" db:"status"` // e.g. "new", "in_progress", "resolved"
	UTMSource   string    `json:"utm_source,omitempty" db:"utm_source"`
	UTMMedium   string    `json:"utm_medium,omitempty" db:"utm_medium"`
	UTMCampaign string    `json:"utm_campaign,omitempty" db:"utm_campaign"`
	UTMTerm     string    `json:"utm_term,omitempty" db:"utm_term"`
	UTMContent  string    `json:"utm_content,omitempty" db:"utm_content"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
