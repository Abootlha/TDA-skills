package admin

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

type AdminEnquiryHandler struct {
	enquiryService services.EnquiryService
}

func NewAdminEnquiryHandler(enquiryService services.EnquiryService) *AdminEnquiryHandler {
	return &AdminEnquiryHandler{enquiryService: enquiryService}
}

func (h *AdminEnquiryHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	enquiries, total, err := h.enquiryService.ListEnquiries(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to fetch enquiries"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"enquiries": enquiries,
			"total":     total,
			"page":      page,
			"limit":     limit,
		},
	})
}

func (h *AdminEnquiryHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	enquiry, err := h.enquiryService.GetEnquiryByID(c.Request.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   gin.H{"message": "Enquiry not found"},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to fetch enquiry details"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    enquiry,
	})
}

func (h *AdminEnquiryHandler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	
	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   gin.H{"message": "Invalid request body"},
		})
		return
	}

	if err := h.enquiryService.UpdateEnquiryStatus(c.Request.Context(), id, req.Status); err != nil {
		if err.Error() == "invalid status" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   gin.H{"message": "Invalid status value"},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to update enquiry status"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"message": "Status updated successfully"},
	})
}

func (h *AdminEnquiryHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.enquiryService.DeleteEnquiry(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to delete enquiry"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"message": "Enquiry deleted successfully"},
	})
}
