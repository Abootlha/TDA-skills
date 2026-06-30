package services

import (
	"context"
	"errors"
	"strings"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type ContactService interface {
	CreateContact(req *CreateContactRequest) (*models.Contact, error)
	ListContacts(ctx context.Context, page, limit int) ([]models.Contact, int, error)
	GetContactByID(ctx context.Context, id string) (*models.Contact, error)
	UpdateContactStatus(ctx context.Context, id, status string) error
	DeleteContact(ctx context.Context, id string) error
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

type CreateContactRequest struct {
	FullName    string `json:"full_name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	EnquiryType string `json:"enquiry_type"`
	Message     string `json:"message"`
	UTMSource   string `json:"utm_source,omitempty"`
	UTMMedium   string `json:"utm_medium,omitempty"`
	UTMCampaign string `json:"utm_campaign,omitempty"`
	UTMTerm     string `json:"utm_term,omitempty"`
	UTMContent  string `json:"utm_content,omitempty"`
}

func (s *contactService) CreateContact(req *CreateContactRequest) (*models.Contact, error) {
	// Basic validation
	req.FullName = strings.TrimSpace(req.FullName)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.PhoneNumber = strings.TrimSpace(req.PhoneNumber)
	
	if req.FullName == "" {
		return nil, errors.New("full name is required")
	}
	if req.Email == "" {
		return nil, errors.New("email is required")
	}
	if req.PhoneNumber == "" {
		return nil, errors.New("phone number is required")
	}

	contact := &models.Contact{
		FullName:    req.FullName,
		Email:       req.Email,
		PhoneNumber: req.PhoneNumber,
		EnquiryType: req.EnquiryType,
		Message:     req.Message,
		UTMSource:   req.UTMSource,
		UTMMedium:   req.UTMMedium,
		UTMCampaign: req.UTMCampaign,
		UTMTerm:     req.UTMTerm,
		UTMContent:  req.UTMContent,
	}

	if err := s.repo.Create(contact); err != nil {
		return nil, err
	}

	return contact, nil
}

func (s *contactService) ListContacts(ctx context.Context, page, limit int) ([]models.Contact, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50
	}
	offset := (page - 1) * limit
	return s.repo.List(ctx, limit, offset)
}

func (s *contactService) GetContactByID(ctx context.Context, id string) (*models.Contact, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *contactService) UpdateContactStatus(ctx context.Context, id, status string) error {
	validStatuses := map[string]bool{"new": true, "in_progress": true, "resolved": true}
	if !validStatuses[status] {
		return errors.New("invalid status")
	}
	return s.repo.UpdateStatus(ctx, id, status)
}

func (s *contactService) DeleteContact(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
