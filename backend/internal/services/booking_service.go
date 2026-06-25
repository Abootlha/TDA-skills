package services

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type BookingService struct {
	repo     *repository.BookingRepository
	courseRepo *repository.CourseRepository
}

func NewBookingService(repo *repository.BookingRepository, courseRepo *repository.CourseRepository) *BookingService {
	return &BookingService{repo: repo, courseRepo: courseRepo}
}

func (s *BookingService) Create(ctx context.Context, userID *uuid.UUID, req *models.CreateBookingRequest) (*models.Booking, error) {
	bookingNumber, err := s.repo.GetNextBookingNumber(ctx)
	if err != nil {
		return nil, err
	}

	// Calculate totals
	var totalAmount, totalDiscount float64
	for _, item := range req.Items {
		totalAmount += item.UnitPrice * float64(item.Quantity)
		totalDiscount += item.Discount
	}

	booking := &models.Booking{
		UserID:          userID,
		BookingNumber:   bookingNumber,
		Status:          "pending",
		BookingType:     req.BookingType,
		PersonalDetails: req.PersonalDetails,
		CompanyDetails:  req.CompanyDetails,
		TestDetails:     req.TestDetails,
		CardDetails:     req.CardDetails,
		NVQDetails:      req.NVQDetails,
		TotalAmount:     totalAmount - totalDiscount,
		DiscountAmount:  totalDiscount,
		Currency:        "GBP",
	}

	if req.Source != "" {
		booking.Source.String = req.Source
		booking.Source.Valid = true
	}
	if req.UTMSource != "" {
		booking.UTMSource.String = req.UTMSource
		booking.UTMSource.Valid = true
	}
	if req.UTMMedium != "" {
		booking.UTMMedium.String = req.UTMMedium
		booking.UTMMedium.Valid = true
	}
	if req.UTMCampaign != "" {
		booking.UTMCampaign.String = req.UTMCampaign
		booking.UTMCampaign.Valid = true
	}
	if req.UTMTerm != "" {
		booking.UTMTerm.String = req.UTMTerm
		booking.UTMTerm.Valid = true
	}
	if req.UTMContent != "" {
		booking.UTMContent.String = req.UTMContent
		booking.UTMContent.Valid = true
	}
	if req.Notes != "" {
		booking.Notes.String = req.Notes
		booking.Notes.Valid = true
	}
	if req.ReferralCode != "" {
		booking.ReferralCode.String = req.ReferralCode
		booking.ReferralCode.Valid = true
	}

	if err := s.repo.Create(ctx, booking); err != nil {
		return nil, err
	}

	// Create booking items
	for _, itemReq := range req.Items {
		item := &models.BookingItem{
			BookingID:   booking.ID,
			Description: itemReq.Description,
			UnitPrice:   itemReq.UnitPrice,
			Quantity:    itemReq.Quantity,
			Discount:    itemReq.Discount,
		}
		// Only set CourseID if it's a valid UUID (course bookings); CITB tests use slugs
		if courseID, err := uuid.Parse(itemReq.CourseID); err == nil {
			item.CourseID = &courseID
		}
		if err := s.repo.CreateItem(ctx, item); err != nil {
			return nil, err
		}
		booking.Items = append(booking.Items, *item)
	}

	return booking, nil
}

func (s *BookingService) GetByID(ctx context.Context, id uuid.UUID) (*models.Booking, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *BookingService) ListByUser(ctx context.Context, userID uuid.UUID, page, limit int) (*models.BookingListResponse, error) {
	bookings, total, err := s.repo.ListByUser(ctx, userID, page, limit)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	return &models.BookingListResponse{
		Bookings:   bookings,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}, nil
}

func (s *BookingService) ListAll(ctx context.Context, params models.BookingListParams) (*models.BookingListResponse, error) {
	bookings, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / params.Limit
	if int(total)%params.Limit > 0 {
		totalPages++
	}

	return &models.BookingListResponse{
		Bookings:   bookings,
		Total:      total,
		Page:       params.Page,
		Limit:      params.Limit,
		TotalPages: totalPages,
	}, nil
}

func (s *BookingService) UpdateStatus(ctx context.Context, id uuid.UUID, req *models.UpdateBookingStatusRequest) error {
	return s.repo.UpdateStatus(ctx, id, req.Status)
}

func (s *BookingService) Cancel(ctx context.Context, id uuid.UUID, reason string) error {
	return s.repo.UpdateStatus(ctx, id, "cancelled")
}

// CreateTestBooking creates a CITB test booking from the public flow.
func (s *BookingService) CreateTestBooking(ctx context.Context, personalDetails, testDetails json.RawMessage) (*models.Booking, error) {
	bookingNumber, err := s.repo.GetNextBookingNumber(ctx)
	if err != nil {
		return nil, err
	}

	booking := &models.Booking{
		BookingNumber:   bookingNumber,
		Status:          "pending",
		BookingType:     "citb-test",
		PersonalDetails: personalDetails,
		TestDetails:     &testDetails,
		TotalAmount:     0,
		Currency:        "GBP",
	}

	if err := s.repo.Create(ctx, booking); err != nil {
		return nil, err
	}

	return booking, nil
}
