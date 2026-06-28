package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/database"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type CourseService struct {
	repo  *repository.CourseRepository
	redis *database.RedisClient
}

func NewCourseService(repo *repository.CourseRepository, redis *database.RedisClient) *CourseService {
	return &CourseService{repo: repo, redis: redis}
}

func (s *CourseService) List(ctx context.Context, params models.CourseListParams) (*models.CourseListResponse, error) {
	courses, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / params.Limit
	if int(total)%params.Limit > 0 {
		totalPages++
	}

	return &models.CourseListResponse{
		Courses:    courses,
		Total:      total,
		Page:       params.Page,
		Limit:      params.Limit,
		TotalPages: totalPages,
	}, nil
}

func (s *CourseService) GetByID(ctx context.Context, id uuid.UUID) (*models.Course, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *CourseService) GetBySlug(ctx context.Context, slug string) (*models.Course, error) {
	// Try cache first
	cacheKey := "courses:detail:" + slug
	cached, err := s.redis.Get(ctx, cacheKey)
	if err == nil && cached != "" {
		course := &models.Course{}
		if json.Unmarshal([]byte(cached), course) == nil {
			return course, nil
		}
	}

	course, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	// Increment view count async
	go s.repo.IncrementViewCount(context.Background(), course.ID)

	// Cache for 10 minutes
	if data, err := json.Marshal(course); err == nil {
		s.redis.Set(ctx, cacheKey, string(data), 10*time.Minute)
	}

	return course, nil
}

func (s *CourseService) Create(ctx context.Context, req *models.CreateCourseRequest, adminID uuid.UUID) (*models.Course, error) {
	course := &models.Course{
		Slug:              req.Slug,
		Name:              req.Name,
		Category:          req.Category,
		SubCategory:       sql.NullString{String: req.SubCategory, Valid: req.SubCategory != ""},
		Type:              req.Type,
		Price:             req.Price,
		SalePrice:         req.SalePrice,
		MaxStudents:       req.MaxStudents,
		IsFeatured:        req.IsFeatured,
		IsActive:          req.IsActive,
		LearningOutcomes:  req.LearningOutcomes,
		FAQ:               req.FAQ,
		AvailableDates:    req.AvailableDates,
		Locations:         req.Locations,
		Images:            req.Images,
		Documents:         req.Documents,
		WhoShouldAttend:   req.WhoShouldAttend,
		Prerequisites:     req.Prerequisites,
		Eligibility:       req.Eligibility,
		Certification:     req.Certification,
		RenewalInfo:       req.RenewalInfo,
		SEOKeywords:       req.SEOKeywords,
		CreatedBy:         &adminID,
		Badges:            req.Badges,
		QuickStats:        req.QuickStats,
		Included:          req.Included,
		Overview:          req.Overview,
		Syllabus:          req.Syllabus,
		RelatedCourses:    req.RelatedCourses,
		Deposit:           req.Deposit,
		Description:       sql.NullString{String: req.Description, Valid: req.Description != ""},
		ShortDescription:  sql.NullString{String: req.ShortDescription, Valid: req.ShortDescription != ""},
	}

	if err := s.repo.Create(ctx, course); err != nil {
		return nil, err
	}

	// Assign categories
	for _, catID := range req.CategoryIDs {
		s.repo.AddCourseCategory(ctx, course.ID, catID)
	}

	s.invalidateCache(ctx)
	return course, nil
}

func (s *CourseService) Update(ctx context.Context, id uuid.UUID, req *models.CreateCourseRequest) (*models.Course, error) {
	course, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	course.Slug = req.Slug
	course.Name = req.Name
	course.Category = req.Category
	course.SubCategory = sql.NullString{String: req.SubCategory, Valid: req.SubCategory != ""}
	course.Type = req.Type
	course.Price = req.Price
	course.SalePrice = req.SalePrice
	course.MaxStudents = req.MaxStudents
	course.IsFeatured = req.IsFeatured
	course.IsActive = req.IsActive
	course.LearningOutcomes = req.LearningOutcomes
	course.FAQ = req.FAQ
	course.AvailableDates = req.AvailableDates
	course.Locations = req.Locations
	course.Images = req.Images
	course.Documents = req.Documents
	course.Badges = req.Badges
	course.QuickStats = req.QuickStats
	course.Included = req.Included
	course.Overview = req.Overview
	course.Syllabus = req.Syllabus
	course.RelatedCourses = req.RelatedCourses
	course.Deposit = req.Deposit
	course.WhoShouldAttend = req.WhoShouldAttend
	course.Prerequisites = req.Prerequisites
	course.Eligibility = req.Eligibility
	course.Certification = req.Certification
	course.RenewalInfo = req.RenewalInfo
	course.SEOKeywords = req.SEOKeywords
	course.Description = sql.NullString{String: req.Description, Valid: req.Description != ""}
	course.ShortDescription = sql.NullString{String: req.ShortDescription, Valid: req.ShortDescription != ""}

	if err := s.repo.Update(ctx, course); err != nil {
		return nil, err
	}

	// Re-assign categories
	s.repo.RemoveCourseCategories(ctx, course.ID)
	for _, catID := range req.CategoryIDs {
		s.repo.AddCourseCategory(ctx, course.ID, catID)
	}

	s.invalidateCache(ctx)
	return course, nil
}

func (s *CourseService) Delete(ctx context.Context, id uuid.UUID) error {
	err := s.repo.Delete(ctx, id)
	if err == nil {
		s.invalidateCache(ctx)
	}
	return err
}

func (s *CourseService) GetCategories(ctx context.Context) ([]models.CourseCategory, error) {
	return s.repo.GetAllCategories(ctx)
}

func (s *CourseService) ListNVQs(ctx context.Context) ([]models.Course, error) {
	return s.repo.ListByType(ctx, "nvq")
}

func (s *CourseService) ListNVQsByLevel(ctx context.Context, level string) ([]models.Course, error) {
	return s.repo.ListByTypeAndSubCategory(ctx, "nvq", "level-"+level)
}

func (s *CourseService) ListCSCSCards(ctx context.Context) ([]models.Course, error) {
	return s.repo.ListByType(ctx, "cscs-card")
}

func (s *CourseService) invalidateCache(ctx context.Context) {
	// Simple: delete known cache keys
	s.redis.Del(ctx, "categories:all")
}
