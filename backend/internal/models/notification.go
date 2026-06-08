package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID         uuid.UUID       `db:"id" json:"id"`
	UserID     uuid.UUID       `db:"user_id" json:"user_id"`
	Type       string          `db:"type" json:"type"`
	Channel    string          `db:"channel" json:"channel"`
	Priority   string          `db:"priority" json:"priority"`
	Title      string          `db:"title" json:"title"`
	Message    string          `db:"message" json:"message"`
	Data       json.RawMessage `db:"data" json:"data,omitempty"`
	IsRead     bool            `db:"is_read" json:"is_read"`
	ReadAt     *time.Time      `db:"read_at" json:"read_at,omitempty"`
	SentEmail  bool            `db:"sent_email" json:"sent_email"`
	SentSMS    bool            `db:"sent_sms" json:"sent_sms"`
	EmailJobID *string         `db:"email_job_id" json:"email_job_id,omitempty"`
	CreatedAt  time.Time       `db:"created_at" json:"created_at"`
}

type CreateNotificationRequest struct {
	UserID   string          `json:"user_id" validate:"required,uuid"`
	Type     string          `json:"type" validate:"required,oneof=booking payment reminder system promo admin security"`
	Channel  string          `json:"channel,omitempty"`
	Priority string          `json:"priority,omitempty"`
	Title    string          `json:"title" validate:"required,max=255"`
	Message  string          `json:"message" validate:"required"`
	Data     json.RawMessage `json:"data,omitempty"`
}

