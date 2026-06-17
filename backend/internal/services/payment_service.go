package services

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/plutov/paypal/v4"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/paymentintent"
	"github.com/stripe/stripe-go/v81/refund"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type PaymentService struct {
	repo        *repository.PaymentRepository
	bookingRepo *repository.BookingRepository
	cfg         *config.Config
	paypalClient *paypal.Client
}

func NewPaymentService(repo *repository.PaymentRepository, bookingRepo *repository.BookingRepository, cfg *config.Config) *PaymentService {
	stripe.Key = cfg.Stripe.SecretKey

	var ppClient *paypal.Client

	// Only init PayPal if real credentials are provided
	clientID := cfg.PayPal.ClientID
	secret := cfg.PayPal.Secret
	isPlaceholder := clientID == "" || secret == "" ||
		clientID == "sb-placeholder-client-id" || secret == "sb-placeholder-secret"

	if isPlaceholder {
		fmt.Println("[PayPal] Credentials not configured — PayPal payments disabled")
	} else {
		paypalEnv := paypal.APIBaseSandBox
		if cfg.PayPal.Env == "live" {
			paypalEnv = paypal.APIBaseLive
		}
		client, err := paypal.NewClient(clientID, secret, paypalEnv)
		if err != nil {
			fmt.Printf("[PayPal] Failed to initialize client: %v\n", err)
		} else {
			ppClient = client
			fmt.Printf("[PayPal] Initialized in %s mode\n", cfg.PayPal.Env)
		}
	}

	return &PaymentService{repo: repo, bookingRepo: bookingRepo, cfg: cfg, paypalClient: ppClient}
}

func (s *PaymentService) CreatePaymentIntent(ctx context.Context, userID *uuid.UUID, req *models.CreatePaymentIntentRequest) (*models.CreatePaymentIntentResponse, error) {
	bookingID, err := uuid.Parse(req.BookingID)
	if err != nil {
		return nil, fmt.Errorf("invalid booking ID")
	}

	// Verify booking exists
	booking, err := s.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		return nil, fmt.Errorf("booking not found")
	}

	currency := req.Currency
	if currency == "" {
		currency = "gbp"
	}

	// Create Stripe PaymentIntent
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(req.Amount * 100)), // Convert to pence
		Currency: stripe.String(currency),
		Metadata: map[string]string{
			"booking_id":     bookingID.String(),
			"booking_number": booking.BookingNumber,
			"user_id":        userID.String(),
		},
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return nil, fmt.Errorf("stripe error: %w", err)
	}

	// Get next payment number
	paymentNumber, _ := s.repo.GetNextPaymentNumber(ctx)

	// Create local payment record
	payment := &models.Payment{
		BookingID:             &bookingID,
		UserID:                userID,
		PaymentNumber:         paymentNumber,
		StripePaymentIntentID: sql.NullString{String: pi.ID, Valid: true},
		Amount:                req.Amount,
		Currency:              currency,
		Status:                "pending",
	}

	if err := s.repo.Create(ctx, payment); err != nil {
		return nil, err
	}

	// Update booking status
	s.bookingRepo.UpdateStatus(ctx, bookingID, "pending_payment")

	return &models.CreatePaymentIntentResponse{
		ClientSecret:    pi.ClientSecret,
		PaymentIntentID: pi.ID,
		PaymentID:       payment.ID.String(),
	}, nil
}

// IsPayPalConfigured returns true if the PayPal client has been initialized with real credentials.
func (s *PaymentService) IsPayPalConfigured() bool {
	return s.paypalClient != nil
}

func (s *PaymentService) CreatePayPalOrder(ctx context.Context, userID *uuid.UUID, bookingIDStr string) (*models.CreatePayPalOrderResponse, error) {
	if s.paypalClient == nil {
		return nil, fmt.Errorf("paypal not configured")
	}

	bookingID, err := uuid.Parse(bookingIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid booking ID")
	}

	booking, err := s.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		return nil, fmt.Errorf("booking not found")
	}

	currency := booking.Currency
	if currency == "" {
		currency = "GBP"
	}

	// Create PayPal Order
	purchaseUnits := []paypal.PurchaseUnitRequest{
		{
			ReferenceID: bookingID.String(),
			Amount: &paypal.PurchaseUnitAmount{
				Currency: currency,
				Value:    fmt.Sprintf("%.2f", booking.TotalAmount),
			},
		},
	}

	_, err = s.paypalClient.GetAccessToken(ctx)
	if err != nil {
		return nil, fmt.Errorf("paypal auth error: %w", err)
	}

	order, err := s.paypalClient.CreateOrder(ctx, "CAPTURE", purchaseUnits, nil, nil)
	if err != nil {
		return nil, fmt.Errorf("paypal create order error: %w", err)
	}

	// Get next payment number
	paymentNumber, _ := s.repo.GetNextPaymentNumber(ctx)

	// Create local payment record
	payment := &models.Payment{
		BookingID:     &bookingID,
		UserID:        userID,
		PaymentNumber: paymentNumber,
		PayPalOrderID: sql.NullString{String: order.ID, Valid: true},
		Amount:        booking.TotalAmount,
		Currency:      currency,
		Status:        "pending",
	}

	if err := s.repo.Create(ctx, payment); err != nil {
		return nil, err
	}

	s.bookingRepo.UpdateStatus(ctx, bookingID, "pending_payment")

	return &models.CreatePayPalOrderResponse{
		OrderID:   order.ID,
		PaymentID: payment.ID.String(),
	}, nil
}

func (s *PaymentService) CapturePayPalOrder(ctx context.Context, orderID string) error {
	if s.paypalClient == nil {
		return fmt.Errorf("paypal not configured")
	}

	payment, err := s.repo.GetByPayPalOrderID(ctx, orderID)
	if err != nil {
		return err
	}

	_, err = s.paypalClient.GetAccessToken(ctx)
	if err != nil {
		return err
	}

	captureReq := paypal.CaptureOrderRequest{}
	capture, err := s.paypalClient.CaptureOrder(ctx, orderID, captureReq)
	if err != nil {
		s.repo.SetFailed(ctx, payment.ID, "CAPTURE_FAILED", err.Error())
		if payment.BookingID != nil {
			s.bookingRepo.UpdateStatus(ctx, *payment.BookingID, "failed")
		}
		return err
	}

	if capture.Status != "COMPLETED" {
		return fmt.Errorf("capture status is not COMPLETED: %s", capture.Status)
	}

	// Find capture ID from the response (in purchase_units[0].payments.captures[0].id)
	var captureID string
	if len(capture.PurchaseUnits) > 0 && capture.PurchaseUnits[0].Payments != nil && len(capture.PurchaseUnits[0].Payments.Captures) > 0 {
		captureID = capture.PurchaseUnits[0].Payments.Captures[0].ID
	}

	s.repo.UpdatePayPalCapture(ctx, payment.ID, captureID)

	if payment.BookingID != nil {
		s.bookingRepo.UpdateStatus(ctx, *payment.BookingID, "confirmed")
	}

	return nil
}

func (s *PaymentService) HandleWebhookPaymentSucceeded(ctx context.Context, piID string) error {
	payment, err := s.repo.GetByPaymentIntentID(ctx, piID)
	if err != nil {
		return err
	}

	s.repo.UpdateStatus(ctx, payment.ID, "succeeded")

	if payment.BookingID != nil {
		s.bookingRepo.UpdateStatus(ctx, *payment.BookingID, "confirmed")
	}

	return nil
}

func (s *PaymentService) HandleWebhookPaymentFailed(ctx context.Context, piID, failCode, failMsg string) error {
	payment, err := s.repo.GetByPaymentIntentID(ctx, piID)
	if err != nil {
		return err
	}

	s.repo.SetFailed(ctx, payment.ID, failCode, failMsg)

	if payment.BookingID != nil {
		s.bookingRepo.UpdateStatus(ctx, *payment.BookingID, "failed")
	}

	return nil
}

func (s *PaymentService) ProcessRefund(ctx context.Context, req *models.RefundRequest) error {
	paymentID, err := uuid.Parse(req.PaymentID)
	if err != nil {
		return fmt.Errorf("invalid payment ID")
	}

	payment, err := s.repo.GetByID(ctx, paymentID)
	if err != nil {
		return err
	}

	if !payment.StripePaymentIntentID.Valid {
		return fmt.Errorf("no stripe payment intent")
	}

	amount := req.Amount
	if amount <= 0 {
		amount = payment.Amount
	}

	// Create Stripe refund
	params := &stripe.RefundParams{
		PaymentIntent: stripe.String(payment.StripePaymentIntentID.String),
		Amount:        stripe.Int64(int64(amount * 100)),
	}

	_, err = refund.New(params)
	if err != nil {
		return fmt.Errorf("stripe refund error: %w", err)
	}

	s.repo.SetRefunded(ctx, payment.ID, amount, req.Reason)

	if payment.BookingID != nil {
		s.bookingRepo.UpdateStatus(ctx, *payment.BookingID, "refunded")
	}

	return nil
}

func (s *PaymentService) GetByID(ctx context.Context, id uuid.UUID) (*models.Payment, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PaymentService) List(ctx context.Context, params models.PaymentListParams) (*models.PaymentListResponse, error) {
	payments, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / params.Limit
	if int(total)%params.Limit > 0 {
		totalPages++
	}

	return &models.PaymentListResponse{
		Payments:   payments,
		Total:      total,
		Page:       params.Page,
		Limit:      params.Limit,
		TotalPages: totalPages,
	}, nil
}
