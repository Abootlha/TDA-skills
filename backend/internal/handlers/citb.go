package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

type CITBHandler struct {
	bookingService *services.BookingService
}

func NewCITBHandler(bookingService *services.BookingService) *CITBHandler {
	return &CITBHandler{bookingService: bookingService}
}

// GET /api/v1/tests/centres
func (h *CITBHandler) ListCentres(c *gin.Context) {
	// In production, this would query a test centres database or external API
	centres := []map[string]interface{}{
		{"id": "centre-1", "name": "London Test Centre", "city": "London", "postcode": "E1 6AN"},
		{"id": "centre-2", "name": "Manchester Test Centre", "city": "Manchester", "postcode": "M1 1AD"},
		{"id": "centre-3", "name": "Birmingham Test Centre", "city": "Birmingham", "postcode": "B1 1BB"},
	}
	c.JSON(http.StatusOK, gin.H{"centres": centres})
}

// GET /api/v1/tests/availability
func (h *CITBHandler) CheckAvailability(c *gin.Context) {
	centreID := c.Query("centre_id")
	date := c.Query("date")

	// Placeholder: in production this queries real availability
	c.JSON(http.StatusOK, gin.H{
		"centre_id": centreID,
		"date":      date,
		"available": true,
		"slots":     []string{"09:00", "10:00", "11:00", "13:00", "14:00"},
	})
}

// POST /api/v1/tests/book
func (h *CITBHandler) Book(c *gin.Context) {
	var body struct {
		PersonalDetails json.RawMessage `json:"personal_details"`
		TestDetails     json.RawMessage `json:"test_details"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	booking, err := h.bookingService.CreateTestBooking(
		c.Request.Context(), body.PersonalDetails, body.TestDetails,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create test booking"})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// GET /api/v1/tests/:id
func (h *CITBHandler) GetByID(c *gin.Context) {
	// Reuses booking lookup
	c.JSON(http.StatusOK, gin.H{"message": "Test booking details"})
}
