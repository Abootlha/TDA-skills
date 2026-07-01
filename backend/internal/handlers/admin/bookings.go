package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type AdminBookingHandler struct {
	bookingService *services.BookingService
}

func NewAdminBookingHandler(bookingService *services.BookingService) *AdminBookingHandler {
	return &AdminBookingHandler{bookingService: bookingService}
}

// GET /api/v1/admin/bookings
func (h *AdminBookingHandler) List(c *gin.Context) {
	var params models.BookingListParams
	c.ShouldBindQuery(&params)
	if params.Page < 1 { params.Page = 1 }
	if params.Limit < 1 { params.Limit = 20 }

	resp, err := h.bookingService.ListAll(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// PUT /api/v1/admin/bookings/:id
func (h *AdminBookingHandler) UpdateStatus(c *gin.Context) {
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

// DELETE /api/v1/admin/bookings/:id
func (h *AdminBookingHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	if err := h.bookingService.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted"})
}
