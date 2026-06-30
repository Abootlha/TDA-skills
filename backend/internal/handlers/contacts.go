package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tdaskills/backend/internal/services"
)

type ContactHandler struct {
	contactService services.ContactService
}

func NewContactHandler(contactService services.ContactService) *ContactHandler {
	return &ContactHandler{contactService: contactService}
}

func (h *ContactHandler) Create(c *gin.Context) {
	var req services.CreateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	contact, err := h.contactService.CreateContact(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Contact enquiry submitted successfully",
		"contact": contact,
	})
}
