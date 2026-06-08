package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type AdminPaymentHandler struct {
	paymentService *services.PaymentService
}

func NewAdminPaymentHandler(paymentService *services.PaymentService) *AdminPaymentHandler {
	return &AdminPaymentHandler{paymentService: paymentService}
}

// GET /api/v1/admin/payments
func (h *AdminPaymentHandler) List(c *gin.Context) {
	var params models.PaymentListParams
	c.ShouldBindQuery(&params)
	if params.Page < 1 { params.Page = 1 }
	if params.Limit < 1 { params.Limit = 20 }

	resp, err := h.paymentService.List(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payments"})
		return
	}
	c.JSON(http.StatusOK, resp)
}
