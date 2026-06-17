package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/database"
)

type CheckoutHandler struct {
	rdb *database.RedisClient
}

func NewCheckoutHandler(rdb *database.RedisClient) *CheckoutHandler {
	return &CheckoutHandler{rdb: rdb}
}

type CartItem struct {
	ID    string  `json:"id"`
	Title string  `json:"title"`
	Price float64 `json:"price"`
	Type  string  `json:"type,omitempty"`
}

type CheckoutDraft struct {
	FormData  *json.RawMessage `json:"formData,omitempty"`
	CartItems *[]CartItem      `json:"cartItems,omitempty"`
}

// POST /api/v1/checkout/draft
func (h *CheckoutHandler) SaveDraft(c *gin.Context) {
	sessionID := c.GetHeader("X-Session-ID")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "X-Session-ID header is required"})
		return
	}

	var incomingDraft CheckoutDraft
	if err := c.ShouldBindJSON(&incomingDraft); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	key := "checkout_draft:" + sessionID

	// Try to get existing draft to merge
	var existingDraft CheckoutDraft
	data, err := h.rdb.Get(c.Request.Context(), key)
	if err == nil {
		json.Unmarshal([]byte(data), &existingDraft)
	}

	// Merge logic using pointers
	if incomingDraft.FormData != nil {
		existingDraft.FormData = incomingDraft.FormData
	}
	if incomingDraft.CartItems != nil {
		existingDraft.CartItems = incomingDraft.CartItems
	}

	mergedData, err := json.Marshal(existingDraft)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize draft"})
		return
	}

	// Save with 24 hour expiration
	if err := h.rdb.Set(c.Request.Context(), key, mergedData, 24*time.Hour); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save draft to Redis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Draft saved successfully"})
}

// GET /api/v1/checkout/draft
func (h *CheckoutHandler) GetDraft(c *gin.Context) {
	sessionID := c.GetHeader("X-Session-ID")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "X-Session-ID header is required"})
		return
	}

	key := "checkout_draft:" + sessionID
	data, err := h.rdb.Get(c.Request.Context(), key)
	if err != nil {
		// Key not found is fine, just return empty
		c.JSON(http.StatusOK, gin.H{"draft": nil})
		return
	}

	var draft CheckoutDraft
	if err := json.Unmarshal([]byte(data), &draft); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse draft"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"draft": draft})
}

// DELETE /api/v1/checkout/draft
func (h *CheckoutHandler) DeleteDraft(c *gin.Context) {
	sessionID := c.GetHeader("X-Session-ID")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "X-Session-ID header is required"})
		return
	}

	key := "checkout_draft:" + sessionID
	if err := h.rdb.Del(c.Request.Context(), key); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete draft"})
		return
	}

	c.SetCookie("checkout_session", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Draft deleted successfully"})
}
