package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tdaskills/backend/internal/services"
)

// AdminCardHandler manages card management operations for administrators
type AdminCardHandler struct {
	cardService services.CardService
}

// NewAdminCardHandler instantiates a new AdminCardHandler
func NewAdminCardHandler(cardService services.CardService) *AdminCardHandler {
	return &AdminCardHandler{cardService: cardService}
}

// GET /api/v1/admin/cards
func (h *AdminCardHandler) List(c *gin.Context) {
	cards, err := h.cardService.ListAllCards(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admin cards", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cards": cards})
}

// GET /api/v1/admin/cards/:id
func (h *AdminCardHandler) Get(c *gin.Context) {
	id := c.Param("id")
	card, err := h.cardService.GetCardByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Card not found"})
		return
	}
	c.JSON(http.StatusOK, card)
}

// POST /api/v1/admin/cards
func (h *AdminCardHandler) Create(c *gin.Context) {
	var req services.CreateCardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	card, err := h.cardService.CreateCard(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create card", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, card)
}

// PUT /api/v1/admin/cards/:id
func (h *AdminCardHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdateCardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	card, err := h.cardService.UpdateCard(c.Request.Context(), id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update card", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, card)
}

// DELETE /api/v1/admin/cards/:id
func (h *AdminCardHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.cardService.DeleteCard(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete card", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Card deleted successfully"})
}
