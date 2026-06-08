package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type CourseRepository struct {
	db *sqlx.DB
}

func NewCourseRepository(db *sqlx.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

func (r *CourseRepository) Create(ctx context.Context, c *models.Course) error {
	query := `INSERT INTO courses (slug, name, category, sub_category, type, short_description, description,
		who_should_attend, learning_outcomes, duration, price, sale_price, price_display, images, documents,
		prerequisites, eligibility, certification, renewal_info, accreditation_body, accreditation_code,
		faq, available_dates, locations, max_students, is_featured, is_active, seo_title, seo_description,
		seo_keywords, created_by)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query,
		c.Slug, c.Name, c.Category, c.SubCategory, c.Type, c.ShortDescription, c.Description,
		c.WhoShouldAttend, c.LearningOutcomes, c.Duration, c.Price, c.SalePrice, c.PriceDisplay,
		c.Images, c.Documents, c.Prerequisites, c.Eligibility, c.Certification, c.RenewalInfo,
		c.AccreditationBody, c.AccreditationCode, c.FAQ, c.AvailableDates, c.Locations,
		c.MaxStudents, c.IsFeatured, c.IsActive, c.SEOTitle, c.SEODescription, c.SEOKeywords, c.CreatedBy,
	).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)
}

func (r *CourseRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Course, error) {
	c := &models.Course{}
	err := r.db.GetContext(ctx, c, "SELECT * FROM courses WHERE id=$1", id)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *CourseRepository) GetBySlug(ctx context.Context, slug string) (*models.Course, error) {
	c := &models.Course{}
	err := r.db.GetContext(ctx, c, "SELECT * FROM courses WHERE slug=$1 AND is_active=TRUE", slug)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *CourseRepository) List(ctx context.Context, params models.CourseListParams) ([]models.Course, int64, error) {
	var total int64
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 20
	}
	offset := (params.Page - 1) * params.Limit

	where := []string{"is_active = TRUE"}
	args := []interface{}{}
	idx := 1

	if params.Category != "" {
		where = append(where, fmt.Sprintf("category = $%d", idx))
		args = append(args, params.Category)
		idx++
	}
	if params.SubCategory != "" {
		where = append(where, fmt.Sprintf("sub_category = $%d", idx))
		args = append(args, params.SubCategory)
		idx++
	}
	if params.Type != "" {
		where = append(where, fmt.Sprintf("type = $%d", idx))
		args = append(args, params.Type)
		idx++
	}
	if params.Search != "" {
		where = append(where, fmt.Sprintf("(name ILIKE $%d OR short_description ILIKE $%d)", idx, idx))
		args = append(args, "%"+params.Search+"%")
		idx++
	}
	if params.Featured != nil && *params.Featured {
		where = append(where, "is_featured = TRUE")
	}

	whereClause := strings.Join(where, " AND ")

	countArgs := make([]interface{}, len(args))
	copy(countArgs, args)
	err := r.db.GetContext(ctx, &total, "SELECT COUNT(*) FROM courses WHERE "+whereClause, countArgs...)
	if err != nil {
		return nil, 0, err
	}

	sortBy := "created_at"
	if params.SortBy == "price" || params.SortBy == "name" || params.SortBy == "view_count" {
		sortBy = params.SortBy
	}
	sortOrder := "DESC"
	if params.SortOrder == "asc" {
		sortOrder = "ASC"
	}

	query := fmt.Sprintf("SELECT * FROM courses WHERE %s ORDER BY %s %s LIMIT $%d OFFSET $%d",
		whereClause, sortBy, sortOrder, idx, idx+1)
	args = append(args, params.Limit, offset)

	var courses []models.Course
	err = r.db.SelectContext(ctx, &courses, query, args...)
	return courses, total, err
}

func (r *CourseRepository) Update(ctx context.Context, c *models.Course) error {
	query := `UPDATE courses SET name=$1, category=$2, sub_category=$3, type=$4, short_description=$5,
		description=$6, duration=$7, price=$8, sale_price=$9, price_display=$10, max_students=$11,
		is_featured=$12, is_active=$13, seo_title=$14, seo_description=$15, images=$16, documents=$17,
		faq=$18, available_dates=$19, locations=$20, learning_outcomes=$21, who_should_attend=$22,
		prerequisites=$23, eligibility=$24, certification=$25, renewal_info=$26, seo_keywords=$27,
		accreditation_body=$28, accreditation_code=$29, updated_at=NOW()
		WHERE id=$30`
	_, err := r.db.ExecContext(ctx, query,
		c.Name, c.Category, c.SubCategory, c.Type, c.ShortDescription,
		c.Description, c.Duration, c.Price, c.SalePrice, c.PriceDisplay, c.MaxStudents,
		c.IsFeatured, c.IsActive, c.SEOTitle, c.SEODescription, c.Images, c.Documents,
		c.FAQ, c.AvailableDates, c.Locations, c.LearningOutcomes, c.WhoShouldAttend,
		c.Prerequisites, c.Eligibility, c.Certification, c.RenewalInfo, c.SEOKeywords,
		c.AccreditationBody, c.AccreditationCode, c.ID)
	return err
}

func (r *CourseRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM courses WHERE id=$1", id)
	return err
}

func (r *CourseRepository) IncrementViewCount(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "UPDATE courses SET view_count = view_count + 1 WHERE id=$1", id)
	return err
}

// --- Categories ---

func (r *CourseRepository) GetAllCategories(ctx context.Context) ([]models.CourseCategory, error) {
	var cats []models.CourseCategory
	err := r.db.SelectContext(ctx, &cats, "SELECT * FROM course_categories WHERE is_active=TRUE ORDER BY display_order ASC")
	return cats, err
}

func (r *CourseRepository) AddCourseCategory(ctx context.Context, courseID, categoryID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO course_category_xref (course_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
		courseID, categoryID)
	return err
}

func (r *CourseRepository) RemoveCourseCategories(ctx context.Context, courseID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM course_category_xref WHERE course_id=$1", courseID)
	return err
}

// --- NVQ specific ---

func (r *CourseRepository) ListByType(ctx context.Context, courseType string) ([]models.Course, error) {
	var courses []models.Course
	err := r.db.SelectContext(ctx, &courses,
		"SELECT * FROM courses WHERE type=$1 AND is_active=TRUE ORDER BY name ASC", courseType)
	return courses, err
}

func (r *CourseRepository) ListByTypeAndSubCategory(ctx context.Context, courseType, subCategory string) ([]models.Course, error) {
	var courses []models.Course
	err := r.db.SelectContext(ctx, &courses,
		"SELECT * FROM courses WHERE type=$1 AND sub_category=$2 AND is_active=TRUE ORDER BY name ASC",
		courseType, subCategory)
	return courses, err
}
