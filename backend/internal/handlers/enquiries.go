package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tdaskills/backend/internal/services"
)

type EnquiryHandler struct {
	enquiryService services.EnquiryService
}

func NewEnquiryHandler(enquiryService services.EnquiryService) *EnquiryHandler {
	return &EnquiryHandler{enquiryService: enquiryService}
}

func (h *EnquiryHandler) Create(c *gin.Context) {
	var req services.CreateEnquiryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	enquiry, err := h.enquiryService.CreateEnquiry(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Enquiry submitted successfully",
		"enquiry": enquiry,
	})
}
