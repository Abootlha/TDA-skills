package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Booking struct {
	ID                uuid.UUID       `db:"id" json:"id"`
	UserID            *uuid.UUID      `db:"user_id" json:"user_id,omitempty"`
	BookingNumber     string          `db:"booking_number" json:"booking_number"`
	Status            string          `db:"status" json:"status"`
	BookingType       string          `db:"booking_type" json:"booking_type"`
	PersonalDetails   json.RawMessage `db:"personal_details" json:"personal_details"`
	TestDetails       json.RawMessage `db:"test_details" json:"test_details,omitempty"`
	CardDetails       json.RawMessage `db:"card_details" json:"card_details,omitempty"`
	NVQDetails        json.RawMessage `db:"nvq_details" json:"nvq_details,omitempty"`
	Source            sql.NullString  `db:"source" json:"source,omitempty"`
	ReferralCode      sql.NullString  `db:"referral_code" json:"referral_code,omitempty"`
	Notes             sql.NullString  `db:"notes" json:"notes,omitempty"`
	AdminNotes        sql.NullString  `db:"admin_notes" json:"admin_notes,omitempty"`
	TotalAmount       float64         `db:"total_amount" json:"total_amount"`
	DiscountAmount    float64         `db:"discount_amount" json:"discount_amount"`
	TaxAmount         float64         `db:"tax_amount" json:"tax_amount"`
	Currency          string          `db:"currency" json:"currency"`
	CreatedBy         *uuid.UUID      `db:"created_by" json:"created_by,omitempty"`
	ConfirmedAt       *time.Time      `db:"confirmed_at" json:"confirmed_at,omitempty"`
	CompletedAt       *time.Time      `db:"completed_at" json:"completed_at,omitempty"`
	CancelledAt       *time.Time      `db:"cancelled_at" json:"cancelled_at,omitempty"`
	CancellationReason sql.NullString `db:"cancellation_reason" json:"cancellation_reason,omitempty"`
	CreatedAt         time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time       `db:"updated_at" json:"updated_at"`
	Items             []BookingItem   `db:"-" json:"items,omitempty"`
}

type BookingItem struct {
	ID          uuid.UUID  `db:"id" json:"id"`
	BookingID   uuid.UUID  `db:"booking_id" json:"booking_id"`
	CourseID    *uuid.UUID `db:"course_id" json:"course_id,omitempty"`
	Description string     `db:"description" json:"description"`
	UnitPrice   float64    `db:"unit_price" json:"unit_price"`
	Quantity    int        `db:"quantity" json:"quantity"`
	Discount    float64    `db:"discount" json:"discount"`
	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
}

type CreateBookingRequest struct {
	BookingType     string                     `json:"booking_type" validate:"required,oneof=course nvq cscs-card citb-test package"`
	PersonalDetails json.RawMessage            `json:"personal_details" validate:"required"`
	TestDetails     json.RawMessage            `json:"test_details,omitempty"`
	CardDetails     json.RawMessage            `json:"card_details,omitempty"`
	NVQDetails      json.RawMessage            `json:"nvq_details,omitempty"`
	Notes           string                     `json:"notes,omitempty"`
	Source          string                     `json:"source,omitempty"`
	ReferralCode    string                     `json:"referral_code,omitempty"`
	Items           []CreateBookingItemRequest `json:"items" validate:"required,min=1"`
}

type CreateBookingItemRequest struct {
	CourseID    string  `json:"course_id" validate:"required,uuid"`
	Description string `json:"description" validate:"required"`
	UnitPrice   float64 `json:"unit_price" validate:"required,gte=0"`
	Quantity    int     `json:"quantity" validate:"required,gte=1"`
	Discount    float64 `json:"discount,omitempty"`
}

type UpdateBookingStatusRequest struct {
	Status             string `json:"status" validate:"required,oneof=draft pending pending_payment confirmed completed cancelled refunded failed"`
	CancellationReason string `json:"cancellation_reason,omitempty"`
	AdminNotes         string `json:"admin_notes,omitempty"`
}

type BookingListParams struct {
	Status      string `form:"status"`
	BookingType string `form:"booking_type"`
	UserID      string `form:"user_id"`
	Search      string `form:"search"`
	Page        int    `form:"page,default=1"`
	Limit       int    `form:"limit,default=20"`
}

type BookingListResponse struct {
	Bookings   []Booking `json:"bookings"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
	TotalPages int       `json:"total_pages"`
}
