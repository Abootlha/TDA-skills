package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// Course represents a training course, NVQ, CSCS card, or CITB test.
type Course struct {
	ID                          uuid.UUID       `db:"id" json:"id"`
	Slug                        string          `db:"slug" json:"slug"`
	Name                        string          `db:"name" json:"name"`
	Category                    string          `db:"category" json:"category"`
	SubCategory                 sql.NullString  `db:"sub_category" json:"sub_category,omitempty"`
	Type                        string          `db:"type" json:"type"`
	ShortDescription            sql.NullString  `db:"short_description" json:"short_description,omitempty"`
	Description                 sql.NullString  `db:"description" json:"description,omitempty"`
	WhoShouldAttend             pq.StringArray  `db:"who_should_attend" json:"who_should_attend,omitempty"`
	LearningOutcomes            json.RawMessage `db:"learning_outcomes" json:"learning_outcomes,omitempty"`
	Duration                    sql.NullString  `db:"duration" json:"duration,omitempty"`
	Price                       float64         `db:"price" json:"price"`
	SalePrice                   *float64        `db:"sale_price" json:"sale_price,omitempty"`
	PriceDisplay                sql.NullString  `db:"price_display" json:"price_display,omitempty"`
	Currency                    string          `db:"currency" json:"currency"`
	Images                      json.RawMessage `db:"images" json:"images,omitempty"`
	Documents                   json.RawMessage `db:"documents" json:"documents,omitempty"`
	Prerequisites               pq.StringArray  `db:"prerequisites" json:"prerequisites,omitempty"`
	Eligibility                 pq.StringArray  `db:"eligibility" json:"eligibility,omitempty"`
	Certification               pq.StringArray  `db:"certification" json:"certification,omitempty"`
	RenewalInfo                 pq.StringArray  `db:"renewal_info" json:"renewal_info,omitempty"`
	PrerequisitesYearsExperience *int           `db:"prerequisites_years_experience" json:"prerequisites_years_experience,omitempty"`
	PrerequisitesMinAge         *int            `db:"prerequisites_min_age" json:"prerequisites_min_age,omitempty"`
	AccreditationBody           sql.NullString  `db:"accreditation_body" json:"accreditation_body,omitempty"`
	AccreditationCode           sql.NullString  `db:"accreditation_code" json:"accreditation_code,omitempty"`
	FAQ                         json.RawMessage `db:"faq" json:"faq,omitempty"`
	AvailableDates              json.RawMessage `db:"available_dates" json:"available_dates,omitempty"`
	Locations                   json.RawMessage `db:"locations" json:"locations,omitempty"`
	MaxStudents                 int             `db:"max_students" json:"max_students"`
	IsFeatured                  bool            `db:"is_featured" json:"is_featured"`
	IsActive                    bool            `db:"is_active" json:"is_active"`
	SEOTitle                    sql.NullString  `db:"seo_title" json:"seo_title,omitempty"`
	SEODescription              sql.NullString  `db:"seo_description" json:"seo_description,omitempty"`
	SEOKeywords                 pq.StringArray  `db:"seo_keywords" json:"seo_keywords,omitempty"`
	ViewCount                   int             `db:"view_count" json:"view_count"`
	OrderCount                  int             `db:"order_count" json:"order_count"`
	CreatedBy                   *uuid.UUID      `db:"created_by" json:"created_by,omitempty"`
	CreatedAt                   time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt                   time.Time       `db:"updated_at" json:"updated_at"`
}

// CourseCategory represents a category for organizing courses.
type CourseCategory struct {
	ID           uuid.UUID      `db:"id" json:"id"`
	Name         string         `db:"name" json:"name"`
	Slug         string         `db:"slug" json:"slug"`
	Description  sql.NullString `db:"description" json:"description,omitempty"`
	Icon         sql.NullString `db:"icon" json:"icon,omitempty"`
	DisplayOrder int            `db:"display_order" json:"display_order"`
	IsActive     bool           `db:"is_active" json:"is_active"`
	CreatedAt    time.Time      `db:"created_at" json:"created_at"`
}

// CourseReview represents a user review for a course.
type CourseReview struct {
	ID          uuid.UUID      `db:"id" json:"id"`
	CourseID    uuid.UUID      `db:"course_id" json:"course_id"`
	UserID      *uuid.UUID     `db:"user_id" json:"user_id,omitempty"`
	BookingID   *uuid.UUID     `db:"booking_id" json:"booking_id,omitempty"`
	Rating      int            `db:"rating" json:"rating"`
	Title       sql.NullString `db:"title" json:"title,omitempty"`
	Content     sql.NullString `db:"content" json:"content,omitempty"`
	IsApproved  bool           `db:"is_approved" json:"is_approved"`
	IsPublished bool           `db:"is_published" json:"is_published"`
	AdminReply  sql.NullString `db:"admin_reply" json:"admin_reply,omitempty"`
	RepliedAt   *time.Time     `db:"replied_at" json:"replied_at,omitempty"`
	RepliedBy   *uuid.UUID     `db:"replied_by" json:"replied_by,omitempty"`
	CreatedAt   time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at" json:"updated_at"`
}

// --- Request/Response DTOs ---

type CourseListParams struct {
	Category    string `form:"category"`
	SubCategory string `form:"sub_category"`
	Type        string `form:"type"`
	Search      string `form:"search"`
	Featured    *bool  `form:"featured"`
	Page        int    `form:"page,default=1"`
	Limit       int    `form:"limit,default=20"`
	SortBy      string `form:"sort_by,default=created_at"`
	SortOrder   string `form:"sort_order,default=desc"`
}

type CourseListResponse struct {
	Courses    []Course `json:"courses"`
	Total      int64    `json:"total"`
	Page       int      `json:"page"`
	Limit      int      `json:"limit"`
	TotalPages int      `json:"total_pages"`
}

type CreateCourseRequest struct {
	Name             string          `json:"name" validate:"required,max=255"`
	Slug             string          `json:"slug" validate:"required,max=255"`
	Category         string          `json:"category" validate:"required,oneof=smsts sssts nvq health-safety card citb"`
	SubCategory      string          `json:"sub_category,omitempty"`
	Type             string          `json:"type" validate:"required,oneof=course nvq cscs-card citb-test"`
	ShortDescription string          `json:"short_description,omitempty"`
	Description      string          `json:"description,omitempty"`
	Duration         string          `json:"duration,omitempty"`
	Price            float64         `json:"price" validate:"required,gte=0"`
	SalePrice        *float64        `json:"sale_price,omitempty"`
	PriceDisplay     string          `json:"price_display,omitempty"`
	MaxStudents      int             `json:"max_students,omitempty"`
	IsFeatured       bool            `json:"is_featured,omitempty"`
	IsActive         bool            `json:"is_active"`
	SEOTitle         string          `json:"seo_title,omitempty"`
	SEODescription   string          `json:"seo_description,omitempty"`
	WhoShouldAttend  []string        `json:"who_should_attend,omitempty"`
	Prerequisites    []string        `json:"prerequisites,omitempty"`
	Eligibility      []string        `json:"eligibility,omitempty"`
	Certification    []string        `json:"certification,omitempty"`
	RenewalInfo      []string        `json:"renewal_info,omitempty"`
	SEOKeywords      []string        `json:"seo_keywords,omitempty"`
	LearningOutcomes json.RawMessage `json:"learning_outcomes,omitempty"`
	FAQ              json.RawMessage `json:"faq,omitempty"`
	AvailableDates   json.RawMessage `json:"available_dates,omitempty"`
	Locations        json.RawMessage `json:"locations,omitempty"`
	Images           json.RawMessage `json:"images,omitempty"`
	Documents        json.RawMessage `json:"documents,omitempty"`
	AccreditationBody string        `json:"accreditation_body,omitempty"`
	AccreditationCode string        `json:"accreditation_code,omitempty"`
	CategoryIDs      []uuid.UUID     `json:"category_ids,omitempty"`
}
