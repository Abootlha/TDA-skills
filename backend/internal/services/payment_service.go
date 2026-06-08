package services

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
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
}

func NewPaymentService(repo *repository.PaymentRepository, bookingRepo *repository.BookingRepository, cfg *config.Config) *PaymentService {
	stripe.Key = cfg.Stripe.SecretKey
	return &PaymentService{repo: repo, bookingRepo: bookingRepo, cfg: cfg}
}

func (s *PaymentService) CreatePaymentIntent(ctx context.Context, userID uuid.UUID, req *models.CreatePaymentIntentRequest) (*models.CreatePaymentIntentResponse, error) {
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
		UserID:                &userID,
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
