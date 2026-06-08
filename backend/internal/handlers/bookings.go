package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type BookingHandler struct {
	bookingService *services.BookingService
}

func NewBookingHandler(bookingService *services.BookingService) *BookingHandler {
	return &BookingHandler{bookingService: bookingService}
}

// GET /api/v1/bookings
func (h *BookingHandler) List(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	page := 1
	limit := 20

	resp, err := h.bookingService.ListByUser(c.Request.Context(), uid, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// GET /api/v1/bookings/:id
func (h *BookingHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	booking, err := h.bookingService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Verify ownership
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)
	if booking.UserID != nil && *booking.UserID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// POST /api/v1/bookings
func (h *BookingHandler) Create(c *gin.Context) {
	var req models.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	booking, err := h.bookingService.Create(c.Request.Context(), uid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// PUT /api/v1/bookings/:id
func (h *BookingHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var req models.UpdateBookingStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.bookingService.UpdateStatus(c.Request.Context(), id, &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking updated"})
}

// DELETE /api/v1/bookings/:id
func (h *BookingHandler) Cancel(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	if err := h.bookingService.Cancel(c.Request.Context(), id, "User cancelled"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled"})
}
