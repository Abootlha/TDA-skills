package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

type CardHandler struct {
	courseService *services.CourseService
}

func NewCardHandler(courseService *services.CourseService) *CardHandler {
	return &CardHandler{courseService: courseService}
}

// GET /api/v1/cards
func (h *CardHandler) List(c *gin.Context) {
	cards, err := h.courseService.ListCSCSCards(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CSCS cards"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cards": cards})
}

// GET /api/v1/cards/:type
func (h *CardHandler) GetByType(c *gin.Context) {
	cardType := c.Param("type")
	// Re-use slug-based lookup for card types
	card, err := h.courseService.GetBySlug(c.Request.Context(), cardType)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Card type not found"})
		return
	}
	c.JSON(http.StatusOK, card)
}

// POST /api/v1/cards/apply
func (h *CardHandler) Apply(c *gin.Context) {
	var body map[string]interface{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	// In a full implementation, this creates a CSCS card application/booking
	c.JSON(http.StatusCreated, gin.H{"message": "Application submitted", "data": body})
}
