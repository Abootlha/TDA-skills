package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

// CardHandler manages public card requests
type CardHandler struct {
	cardService services.CardService
}

// NewCardHandler instantiates a public CardHandler
func NewCardHandler(cardService services.CardService) *CardHandler {
	return &CardHandler{cardService: cardService}
}

// GET /api/v1/cards
func (h *CardHandler) List(c *gin.Context) {
	cardType := c.Query("type")
	cards, err := h.cardService.ListCards(c.Request.Context(), cardType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cards", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cards": cards})
}

// GET /api/v1/cards/:slug
func (h *CardHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	card, err := h.cardService.GetCardBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Card not found"})
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
	c.JSON(http.StatusCreated, gin.H{"message": "Application submitted", "data": body})
}
