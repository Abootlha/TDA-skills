package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/services"
)

type NotificationHandler struct {
	notifService *services.NotificationService
}

func NewNotificationHandler(notifService *services.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifService: notifService}
}

// GET /api/v1/notifications
func (h *NotificationHandler) List(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	notifs, total, err := h.notifService.GetByUser(c.Request.Context(), uid, 1, 50)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}

	unread, _ := h.notifService.GetUnreadCount(c.Request.Context(), uid)

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifs,
		"total":         total,
		"unread_count":  unread,
	})
}

// PUT /api/v1/notifications/:id/read
func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	if err := h.notifService.MarkAsRead(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Marked as read"})
}

// PUT /api/v1/notifications/read-all
func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	if err := h.notifService.MarkAllAsRead(c.Request.Context(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark all as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "All notifications marked as read"})
}

// DELETE /api/v1/notifications/:id
func (h *NotificationHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
		return
	}

	if err := h.notifService.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification deleted"})
}

// GET /api/v1/notifications/unread-count
func (h *NotificationHandler) UnreadCount(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	count, err := h.notifService.GetUnreadCount(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get unread count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"unread_count": count,
	})
}

