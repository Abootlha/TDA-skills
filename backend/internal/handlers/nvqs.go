package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

type NVQHandler struct {
	courseService *services.CourseService
}

func NewNVQHandler(courseService *services.CourseService) *NVQHandler {
	return &NVQHandler{courseService: courseService}
}

// GET /api/v1/nvqs
func (h *NVQHandler) List(c *gin.Context) {
	nvqs, err := h.courseService.ListNVQs(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch NVQs"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"nvqs": nvqs})
}

// GET /api/v1/nvqs/:level
func (h *NVQHandler) ListByLevel(c *gin.Context) {
	level := c.Param("level")
	nvqs, err := h.courseService.ListNVQsByLevel(c.Request.Context(), level)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch NVQs"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"nvqs": nvqs, "level": level})
}
