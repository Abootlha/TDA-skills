package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
	"github.com/tdaskills/backend/internal/services"
)

type DashboardHandler struct {
	adminRepo   *repository.AdminRepository
	authService *services.AuthService
}

func NewDashboardHandler(adminRepo *repository.AdminRepository, authService *services.AuthService) *DashboardHandler {
	return &DashboardHandler{adminRepo: adminRepo, authService: authService}
}

// GET /api/v1/admin/dashboard
func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.adminRepo.GetDashboardStats(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dashboard stats"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// POST /api/v1/admin/login
func (h *DashboardHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	resp, err := h.authService.AdminLogin(c.Request.Context(), &models.AdminLoginRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, resp)
}
