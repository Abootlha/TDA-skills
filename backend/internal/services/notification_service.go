package services

import (
	"context"

	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type NotificationService struct {
	repo *repository.NotificationRepository
}

func NewNotificationService(repo *repository.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) Create(ctx context.Context, req *models.CreateNotificationRequest) (*models.Notification, error) {
	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, err
	}

	channel := req.Channel
	if channel == "" {
		channel = "in_app"
	}

	n := &models.Notification{
		UserID:  userID,
		Type:    req.Type,
		Channel: channel,
		Title:   req.Title,
		Message: req.Message,
		Data:    req.Data,
	}

	if err := s.repo.Create(ctx, n); err != nil {
		return nil, err
	}

	return n, nil
}

func (s *NotificationService) GetByUser(ctx context.Context, userID uuid.UUID, page, limit int) ([]models.Notification, int64, error) {
	return s.repo.GetByUser(ctx, userID, page, limit)
}

func (s *NotificationService) GetUnreadCount(ctx context.Context, userID uuid.UUID) (int64, error) {
	return s.repo.GetUnreadCount(ctx, userID)
}

func (s *NotificationService) MarkAsRead(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkAsRead(ctx, id)
}

func (s *NotificationService) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	return s.repo.MarkAllAsRead(ctx, userID)
}

func (s *NotificationService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}

