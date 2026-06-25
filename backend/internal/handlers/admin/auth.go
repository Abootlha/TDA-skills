package admin

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
	"github.com/tdaskills/backend/internal/services"
)

type AdminAuthHandler struct {
	adminRepo     *repository.AdminRepository
	authService   *services.AuthService
	cryptoService *services.CryptoService
	emailService  *services.EmailService
}

func NewAdminAuthHandler(
	adminRepo *repository.AdminRepository,
	authService *services.AuthService,
	cryptoService *services.CryptoService,
	emailService *services.EmailService,
) *AdminAuthHandler {
	return &AdminAuthHandler{
		adminRepo:     adminRepo,
		authService:   authService,
		cryptoService: cryptoService,
		emailService:  emailService,
	}
}

// POST /api/v1/admin/auth/login
func (h *AdminAuthHandler) Login(c *gin.Context) {
	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"},
		})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	resp, err := h.authService.AdminLogin(c.Request.Context(), &req)
	if err != nil {
		switch err {
		case services.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"},
			})
		case services.ErrAccountLocked:
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "ACCOUNT_LOCKED", "message": "Account locked. Try again after 30 minutes"},
			})
		default:
			log.Printf("AdminLogin error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   gin.H{"code": "INTERNAL_ERROR", "message": "Login failed"},
			})
		}
		return
	}

	// Create admin session (1 hour expiry)
	sessionExpiry := time.Now().Add(1 * time.Hour)
	resp.SessionExpiresAt = &sessionExpiry

	// Log activity
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		AdminID:   &resp.Admin.ID,
		EventType: "login_success",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
		UserAgent: sql.NullString{String: c.GetHeader("User-Agent"), Valid: true},
	})

	// Send login notification email
	go h.emailService.SendTemplatedEmail(resp.Admin.Email, "admin_new_login", "New login to your Admin account - TDA Skills", map[string]string{
		"AdminName":  resp.Admin.FirstName + " " + resp.Admin.LastName,
		"LoginTime":  time.Now().Format("02 Jan 2006, 15:04 MST"),
		"IPAddress":  c.ClientIP(),
		"DeviceInfo": c.GetHeader("User-Agent"),
	})

	// Set session cookies (1 hour expiry)
	maxAge := 3600
	cookieDomain := os.Getenv("COOKIE_DOMAIN")
	if cookieDomain == "" && os.Getenv("ENV") == "production" {
		cookieDomain = ".tdaskills.co.uk"
	}
	isSecure := os.Getenv("ENV") == "production"

	c.SetSameSite(http.SameSiteLaxMode)

	c.SetCookie("tda_session", "true", maxAge, "/", cookieDomain, isSecure, false)
	c.SetCookie("admin_access_token", resp.AccessToken, maxAge, "/", cookieDomain, isSecure, true)

	if resp.RefreshToken != "" {
		// Set HttpOnly cookie for refresh token
		c.SetCookie("admin_refresh_token", resp.RefreshToken, maxAge, "/", cookieDomain, isSecure, true)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

// GET /api/v1/admin/auth/me
func (h *AdminAuthHandler) GetMe(c *gin.Context) {
	adminID, exists := c.Get("admin_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   gin.H{"code": "UNAUTHORIZED", "message": "Not authenticated"},
		})
		return
	}

	adminIDStr, ok := adminID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"code": "INTERNAL_ERROR", "message": "Invalid admin ID type"},
		})
		return
	}

	adminUUID, err := uuid.Parse(adminIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   gin.H{"code": "INVALID_UUID", "message": "Invalid admin ID format"},
		})
		return
	}

	admin, err := h.adminRepo.GetByID(c.Request.Context(), adminUUID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   gin.H{"code": "NOT_FOUND", "message": "Admin not found"},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":          admin.ID,
			"email":       admin.Email,
			"first_name":  admin.FirstName,
			"last_name":   admin.LastName,
			"role":        admin.Role,
			"permissions": admin.Permissions,
			"avatar_url":  admin.AvatarURL,
			"last_login":  admin.LastLogin,
		},
	})
}

// POST /api/v1/admin/auth/refresh
func (h *AdminAuthHandler) Refresh(c *gin.Context) {
	var body struct {
		RefreshToken string `json:"refresh_token"`
	}

	refreshToken, err := c.Cookie("admin_refresh_token")
	if err != nil || refreshToken == "" {
		if c.ShouldBindJSON(&body) != nil || body.RefreshToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"code": "TOKEN_EXPIRED", "message": "Session expired, please login again"},
			})
			return
		}
		refreshToken = body.RefreshToken
	}

	resp, err := h.authService.RefreshAccessToken(c.Request.Context(), refreshToken, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   gin.H{"code": "SESSION_EXPIRED", "message": "Your session has expired. Please login again."},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token": resp.AccessToken,
			"expires_in":   resp.ExpiresIn,
		},
	})
}

// POST /api/v1/admin/auth/logout
func (h *AdminAuthHandler) Logout(c *gin.Context) {
	adminID, _ := c.Get("admin_id")

	authHeader := c.GetHeader("Authorization")
	token := ""
	if parts := strings.SplitN(authHeader, " ", 2); len(parts) == 2 {
		token = parts[1]
	}

	if adminIDStr, ok := adminID.(string); ok {
		h.authService.Logout(c.Request.Context(), adminIDStr, token)
	}

	cookieDomain := os.Getenv("COOKIE_DOMAIN")
	if cookieDomain == "" && os.Getenv("ENV") == "production" {
		cookieDomain = ".tdaskills.co.uk"
	}
	isSecure := os.Getenv("ENV") == "production"

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("admin_access_token", "", -1, "/", cookieDomain, isSecure, true)
	c.SetCookie("admin_refresh_token", "", -1, "/", cookieDomain, isSecure, true)
	c.SetCookie("tda_session", "", -1, "/", cookieDomain, isSecure, false)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"message": "Logged out"},
	})
}
