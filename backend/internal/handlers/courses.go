package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type CourseHandler struct {
	courseService *services.CourseService
}

func NewCourseHandler(courseService *services.CourseService) *CourseHandler {
	return &CourseHandler{courseService: courseService}
}

// GET /api/v1/courses
func (h *CourseHandler) List(c *gin.Context) {
	var params models.CourseListParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameters"})
		return
	}
	if params.Page < 1 { params.Page = 1 }
	if params.Limit < 1 { params.Limit = 20 }

	resp, err := h.courseService.List(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// GET /api/v1/courses/:slug
func (h *CourseHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Slug is required"})
		return
	}

	course, err := h.courseService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch course"})
		return
	}

	c.JSON(http.StatusOK, course)
}

// GET /api/v1/courses/categories
func (h *CourseHandler) GetCategories(c *gin.Context) {
	cats, err := h.courseService.GetCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": cats})
}
