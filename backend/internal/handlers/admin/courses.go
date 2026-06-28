package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type AdminCourseHandler struct {
	courseService *services.CourseService
}

func NewAdminCourseHandler(courseService *services.CourseService) *AdminCourseHandler {
	return &AdminCourseHandler{courseService: courseService}
}

// GET /api/v1/admin/courses
func (h *AdminCourseHandler) List(c *gin.Context) {
	var params models.CourseListParams
	c.ShouldBindQuery(&params)
	if params.Page < 1 { params.Page = 1 }
	if params.Limit < 1 { params.Limit = 20 }
	params.ShowAll = true

	resp, err := h.courseService.List(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// GET /api/v1/admin/courses/:id
func (h *AdminCourseHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	course, err := h.courseService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, course)
}

// POST /api/v1/admin/courses
func (h *AdminCourseHandler) Create(c *gin.Context) {
	var req models.CreateCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	adminID, _ := uuid.Parse(c.GetString("admin_id"))

	course, err := h.courseService.Create(c.Request.Context(), &req, adminID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create course", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, course)
}

// PUT /api/v1/admin/courses/:id
func (h *AdminCourseHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	var req models.CreateCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	course, err := h.courseService.Update(c.Request.Context(), id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course"})
		return
	}

	c.JSON(http.StatusOK, course)
}

// DELETE /api/v1/admin/courses/:id
func (h *AdminCourseHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	if err := h.courseService.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course deleted"})
}
