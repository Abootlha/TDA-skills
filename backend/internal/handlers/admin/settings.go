package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

type SettingsHandler struct {
	adminRepo *repository.AdminRepository
}

func NewSettingsHandler(adminRepo *repository.AdminRepository) *SettingsHandler {
	return &SettingsHandler{adminRepo: adminRepo}
}

// GET /api/v1/admin/settings
func (h *SettingsHandler) List(c *gin.Context) {
	settings, err := h.adminRepo.GetPublicSettings(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"settings": settings})
}

// GET /api/v1/admin/settings/:key
func (h *SettingsHandler) GetByKey(c *gin.Context) {
	key := c.Param("key")
	setting, err := h.adminRepo.GetSetting(c.Request.Context(), key)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Setting not found"})
		return
	}
	c.JSON(http.StatusOK, setting)
}

// PUT /api/v1/admin/settings/:key
func (h *SettingsHandler) Update(c *gin.Context) {
	key := c.Param("key")
	var req models.UpdateSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	adminID, _ := uuid.Parse(middleware.GetUserID(c))
	isPublic := false
	if req.IsPublic != nil {
		isPublic = *req.IsPublic
	}

	setting := &models.AdminSettings{
		Key:      key,
		Value:    req.Value,
		IsPublic: isPublic,
		UpdatedBy: &adminID,
	}

	if err := h.adminRepo.UpsertSetting(c.Request.Context(), setting); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update setting"})
		return
	}

	c.JSON(http.StatusOK, setting)
}
