package admin

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/services"
)

type AdminContactHandler struct {
	contactService services.ContactService
}

func NewAdminContactHandler(contactService services.ContactService) *AdminContactHandler {
	return &AdminContactHandler{contactService: contactService}
}

func (h *AdminContactHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	contacts, total, err := h.contactService.ListContacts(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to fetch contact enquiries"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"contacts": contacts,
			"total":    total,
			"page":     page,
			"limit":    limit,
		},
	})
}

func (h *AdminContactHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	contact, err := h.contactService.GetContactByID(c.Request.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   gin.H{"message": "Contact enquiry not found"},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to fetch contact enquiry details"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    contact,
	})
}

func (h *AdminContactHandler) UpdateStatus(c *gin.Context) {
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

	if err := h.contactService.UpdateContactStatus(c.Request.Context(), id, req.Status); err != nil {
		if err.Error() == "invalid status" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   gin.H{"message": "Invalid status value"},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to update contact status"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"message": "Status updated successfully"},
	})
}

func (h *AdminContactHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.contactService.DeleteContact(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": "Failed to delete contact enquiry"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"message": "Contact enquiry deleted successfully"},
	})
}
