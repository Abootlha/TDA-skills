package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Payment struct {
	ID                    uuid.UUID       `db:"id" json:"id"`
	BookingID             *uuid.UUID      `db:"booking_id" json:"booking_id,omitempty"`
	UserID                *uuid.UUID      `db:"user_id" json:"user_id,omitempty"`
	PaymentNumber         string          `db:"payment_number" json:"payment_number"`
	StripePaymentIntentID sql.NullString  `db:"stripe_payment_intent_id" json:"stripe_payment_intent_id,omitempty"`
	StripeChargeID        sql.NullString  `db:"stripe_charge_id" json:"stripe_charge_id,omitempty"`
	StripeCustomerID      sql.NullString  `db:"stripe_customer_id" json:"stripe_customer_id,omitempty"`
	Amount                float64         `db:"amount" json:"amount"`
	Currency              string          `db:"currency" json:"currency"`
	Status                string          `db:"status" json:"status"`
	PaymentMethod         sql.NullString  `db:"payment_method" json:"payment_method,omitempty"`
	CardBrand             sql.NullString  `db:"card_brand" json:"card_brand,omitempty"`
	CardLast4             sql.NullString  `db:"card_last4" json:"card_last4,omitempty"`
	CardExpMonth          *int            `db:"card_exp_month" json:"card_exp_month,omitempty"`
	CardExpYear           *int            `db:"card_exp_year" json:"card_exp_year,omitempty"`
	ReceiptURL            sql.NullString  `db:"receipt_url" json:"receipt_url,omitempty"`
	ReceiptNumber         sql.NullString  `db:"receipt_number" json:"receipt_number,omitempty"`
	RefundedAmount        float64         `db:"refunded_amount" json:"refunded_amount"`
	RefundedAt            *time.Time      `db:"refunded_at" json:"refunded_at,omitempty"`
	RefundReason          sql.NullString  `db:"refund_reason" json:"refund_reason,omitempty"`
	FailureCode           sql.NullString  `db:"failure_code" json:"failure_code,omitempty"`
	FailureMessage        sql.NullString  `db:"failure_message" json:"failure_message,omitempty"`
	Metadata              json.RawMessage `db:"metadata" json:"metadata,omitempty"`
	CreatedAt             time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt             time.Time       `db:"updated_at" json:"updated_at"`
}

type CreatePaymentIntentRequest struct {
	BookingID string  `json:"booking_id" validate:"required,uuid"`
	Amount    float64 `json:"amount" validate:"required,gt=0"`
	Currency  string  `json:"currency,omitempty"`
}

type CreatePaymentIntentResponse struct {
	ClientSecret    string `json:"client_secret"`
	PaymentIntentID string `json:"payment_intent_id"`
	PaymentID       string `json:"payment_id"`
}

type RefundRequest struct {
	PaymentID string  `json:"payment_id" validate:"required,uuid"`
	Amount    float64 `json:"amount,omitempty"`
	Reason    string  `json:"reason,omitempty"`
}

type PaymentListParams struct {
	Status string `form:"status"`
	UserID string `form:"user_id"`
	Page   int    `form:"page,default=1"`
	Limit  int    `form:"limit,default=20"`
}

type PaymentListResponse struct {
	Payments   []Payment `json:"payments"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
	TotalPages int       `json:"total_pages"`
}
