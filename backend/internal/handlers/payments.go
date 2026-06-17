package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v81/webhook"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type PaymentHandler struct {
	paymentService *services.PaymentService
	cfg            *config.Config
}

func NewPaymentHandler(paymentService *services.PaymentService, cfg *config.Config) *PaymentHandler {
	return &PaymentHandler{paymentService: paymentService, cfg: cfg}
}

// GET /api/v1/payments/paypal/status
func (h *PaymentHandler) PayPalStatus(c *gin.Context) {
	available := h.paymentService.IsPayPalConfigured()
	c.JSON(http.StatusOK, gin.H{
		"available": available,
		"message":   map[bool]string{true: "PayPal is available", false: "PayPal is not configured"}[available],
	})
}


// POST /api/v1/payments/create-intent
func (h *PaymentHandler) CreateIntent(c *gin.Context) {
	var req models.CreatePaymentIntentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userID := middleware.GetUserID(c)
	var uidPtr *uuid.UUID
	if userID != "" {
		uid, err := uuid.Parse(userID)
		if err == nil {
			uidPtr = &uid
		}
	}

	resp, err := h.paymentService.CreatePaymentIntent(c.Request.Context(), uidPtr, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// POST /api/v1/payments/paypal/create-order
func (h *PaymentHandler) CreatePayPalOrder(c *gin.Context) {
	var req struct {
		BookingID string `json:"booking_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userID := middleware.GetUserID(c)
	var uidPtr *uuid.UUID
	if userID != "" {
		uid, err := uuid.Parse(userID)
		if err == nil {
			uidPtr = &uid
		}
	}

	resp, err := h.paymentService.CreatePayPalOrder(c.Request.Context(), uidPtr, req.BookingID)
	if err != nil {
		log.Printf("[ERROR] PaymentHandler.CreatePayPalOrder (booking=%s): %v", req.BookingID, err)
		code := http.StatusInternalServerError
		msg := "Failed to initialize PayPal order. Please try again."
		if err.Error() == "booking not found" || err.Error() == "invalid booking ID" {
			code = http.StatusBadRequest
			msg = "Booking not found. Please refresh and try again."
		} else if err.Error() == "paypal not configured" {
			code = http.StatusServiceUnavailable
			msg = "PayPal is currently unavailable. Please try another payment method."
		}
		c.JSON(code, gin.H{"error": msg})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// POST /api/v1/payments/paypal/capture-order
func (h *PaymentHandler) CapturePayPalOrder(c *gin.Context) {
	var req struct {
		OrderID string `json:"order_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.paymentService.CapturePayPalOrder(c.Request.Context(), req.OrderID); err != nil {
		log.Printf("[ERROR] PaymentHandler.CapturePayPalOrder (order=%s): %v", req.OrderID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment capture failed. Please contact support."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment captured successfully"})
}

// POST /api/v1/payments/confirm
func (h *PaymentHandler) Confirm(c *gin.Context) {
	// Client-side confirmation via Stripe.js; this endpoint is for any server-side follow-up
	c.JSON(http.StatusOK, gin.H{"message": "Payment confirmation handled via webhook"})
}

// GET /api/v1/payments/:id
func (h *PaymentHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID"})
		return
	}

	payment, err := h.paymentService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// POST /api/v1/payments/webhook
func (h *PaymentHandler) Webhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read body"})
		return
	}

	sig := c.GetHeader("Stripe-Signature")
	event, err := webhook.ConstructEvent(body, sig, h.cfg.Stripe.WebhookSecret)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid webhook signature"})
		return
	}

	ctx := c.Request.Context()

	switch event.Type {
	case "payment_intent.succeeded":
		var pi struct {
			ID string `json:"id"`
		}
		json.Unmarshal(event.Data.Raw, &pi)
		h.paymentService.HandleWebhookPaymentSucceeded(ctx, pi.ID)

	case "payment_intent.payment_failed":
		var pi struct {
			ID              string `json:"id"`
			LastPaymentError struct {
				Code    string `json:"code"`
				Message string `json:"message"`
			} `json:"last_payment_error"`
		}
		json.Unmarshal(event.Data.Raw, &pi)
		h.paymentService.HandleWebhookPaymentFailed(ctx, pi.ID, pi.LastPaymentError.Code, pi.LastPaymentError.Message)
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

// POST /api/v1/payments/refund (admin)
func (h *PaymentHandler) Refund(c *gin.Context) {
	var req models.RefundRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.paymentService.ProcessRefund(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Refund processed"})
}
