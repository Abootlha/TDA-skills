package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
	"github.com/tdaskills/backend/internal/services"
)

type ProfileHandler struct {
	userRepo      *repository.UserRepository
	authService   *services.AuthService
	cryptoService *services.CryptoService
	emailService  *services.EmailService
}

func NewProfileHandler(
	userRepo *repository.UserRepository,
	authService *services.AuthService,
	cryptoService *services.CryptoService,
	emailService *services.EmailService,
) *ProfileHandler {
	return &ProfileHandler{
		userRepo:      userRepo,
		authService:   authService,
		cryptoService: cryptoService,
		emailService:  emailService,
	}
}

// GET /api/v1/dashboard/profile
func (h *ProfileHandler) GetProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid user ID"}})
		return
	}

	user, err := h.userRepo.GetByID(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": gin.H{"code": "NOT_FOUND", "message": "User not found"}})
		return
	}

	// Get profile
	profile, _ := h.userRepo.GetProfile(c.Request.Context(), uid)

	// Get address
	address, _ := h.userRepo.GetAddress(c.Request.Context(), uid)

	// Get sessions
	sessions, _ := h.userRepo.GetUserSessions(c.Request.Context(), uid)
	sessionResponses := make([]models.SessionResponse, 0, len(sessions))
	for _, s := range sessions {
		sessionResponses = append(sessionResponses, models.SessionResponse{
			ID:           s.ID,
			DeviceInfo:   s.DeviceInfo,
			IPAddress:    s.IPAddress.String,
			CreatedAt:    s.CreatedAt,
			LastActivity: s.LastActivity,
			Current:      false, // TODO: compare with current session
		})
	}

	// Get login history
	loginHistory, _ := h.cryptoService.GetLoginHistory(c.Request.Context(), userID, 20)

	// Check 2FA status
	twoFAEnabled := false
	twoFA, _ := h.userRepo.GetTwoFactorSecret(c.Request.Context(), uid)
	if twoFA != nil && twoFA.IsEnabled {
		twoFAEnabled = true
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": models.ProfileResponse{
			User:             user,
			Profile:          profile,
			Address:          address,
			TwoFactorEnabled: twoFAEnabled,
			Sessions:         sessionResponses,
			LoginHistory:     loginHistory,
		},
	})
}

// PUT /api/v1/dashboard/profile
func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid user ID"}})
		return
	}

	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Update user basic info
	user, err := h.userRepo.GetByID(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": gin.H{"code": "NOT_FOUND", "message": "User not found"}})
		return
	}

	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Phone != "" {
		user.Phone = sql.NullString{String: req.Phone, Valid: true}
	}

	if err := h.userRepo.Update(c.Request.Context(), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to update profile"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"user": user, "message": "Profile updated"},
	})
}

// PUT /api/v1/dashboard/profile/password
func (h *ProfileHandler) ChangePassword(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid user ID"}})
		return
	}

	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Validate new password strength
	if err := h.cryptoService.ValidatePasswordStrength(req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "WEAK_PASSWORD", "message": err.Error()}})
		return
	}

	// Verify current password
	user, err := h.userRepo.GetByID(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": gin.H{"code": "NOT_FOUND", "message": "User not found"}})
		return
	}

	if err := services.ComparePassword(user.PasswordHash, req.CurrentPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_PASSWORD", "message": "Current password is incorrect"}})
		return
	}

	// Hash new password and update
	if err := h.userRepo.UpdatePassword(c.Request.Context(), uid, req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to change password"}})
		return
	}

	// Revoke other sessions if requested
	otherSessionsRevoked := false
	if req.LogoutOtherSessions {
		h.userRepo.RevokeAllUserTokens(c.Request.Context(), uid)
		otherSessionsRevoked = true
	}

	// Log activity
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		UserID:    &uid,
		EventType: "password_changed",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
		UserAgent: sql.NullString{String: c.GetHeader("User-Agent"), Valid: true},
	})

	// Send notification email
	h.emailService.SendTemplatedEmail(user.Email, "password_changed", "Your password has been changed - TDA Skills", map[string]string{
		"FirstName":  user.FirstName,
		"ChangedAt":  strings.Replace(c.GetHeader("Date"), "", "now", 1),
		"IPAddress":  c.ClientIP(),
		"DeviceInfo": c.GetHeader("User-Agent"),
	})

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":                    "Password changed successfully",
			"all_other_sessions_revoked": otherSessionsRevoked,
		},
	})
}

// DELETE /api/v1/dashboard/profile/sessions/:session_id
func (h *ProfileHandler) RevokeSession(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)
	sessionID := c.Param("session_id")
	sid, err := uuid.Parse(sessionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid session ID"}})
		return
	}

	if err := h.userRepo.RevokeSession(c.Request.Context(), uid, sid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to revoke session"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"message": "Session revoked"}})
}

// DELETE /api/v1/dashboard/profile/sessions/all
func (h *ProfileHandler) RevokeAllSessions(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	if err := h.userRepo.RevokeAllSessions(c.Request.Context(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to revoke sessions"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"message": "All other sessions revoked"}})
}

// --- 2FA Handlers ---

// POST /api/v1/auth/2fa/setup
func (h *ProfileHandler) Setup2FA(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)
	email, _ := c.Get("email")

	// Generate TOTP secret
	secret, err := h.cryptoService.GenerateTOTPSecret()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to generate 2FA secret"}})
		return
	}

	// Generate backup codes
	backupCodes, err := h.cryptoService.GenerateBackupCodes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to generate backup codes"}})
		return
	}

	// Hash backup codes for storage
	hashedCodes := make([]string, len(backupCodes))
	for i, code := range backupCodes {
		hashed, err := h.cryptoService.HashBackupCode(code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to hash backup codes"}})
			return
		}
		hashedCodes[i] = hashed
	}

	codesJSON, _ := json.Marshal(hashedCodes)

	// Store secret (not yet enabled)
	if err := h.userRepo.UpsertTwoFactorSecret(c.Request.Context(), uid, secret, codesJSON); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to store 2FA secret"}})
		return
	}

	qrURL := h.cryptoService.GenerateQRCodeURL(email.(string), secret)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": models.TwoFactorSetupResponse{
			QRCodeURL:   qrURL,
			Secret:      secret,
			BackupCodes: backupCodes,
			Message:     "Save these backup codes in a safe place. You won't be able to see them again.",
		},
	})
}

// POST /api/v1/auth/2fa/enable
func (h *ProfileHandler) Enable2FA(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	var req models.TwoFactorCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Get stored secret
	twoFA, err := h.userRepo.GetTwoFactorSecret(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "2FA_NOT_ENABLED", "message": "2FA setup not initiated"}})
		return
	}

	// Verify code
	if !h.cryptoService.VerifyTOTP(twoFA.Secret, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "INVALID_2FA_CODE", "message": "Invalid verification code"}})
		return
	}

	// Enable 2FA
	if err := h.userRepo.EnableTwoFactor(c.Request.Context(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to enable 2FA"}})
		return
	}

	// Log activity
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		UserID:    &uid,
		EventType: "2fa_enabled",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
	})

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":               "Two-factor authentication enabled",
			"two_factor_enabled":    true,
			"backup_codes_remaining": 10,
		},
	})
}

// POST /api/v1/auth/2fa/disable
func (h *ProfileHandler) Disable2FA(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)

	var req models.TwoFactorCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Get and verify
	twoFA, err := h.userRepo.GetTwoFactorSecret(c.Request.Context(), uid)
	if err != nil || !twoFA.IsEnabled {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "2FA_NOT_ENABLED", "message": "2FA is not enabled"}})
		return
	}

	if !h.cryptoService.VerifyTOTP(twoFA.Secret, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "INVALID_2FA_CODE", "message": "Invalid verification code"}})
		return
	}

	// Disable 2FA
	if err := h.userRepo.DisableTwoFactor(c.Request.Context(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to disable 2FA"}})
		return
	}

	// Log activity
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		UserID:    &uid,
		EventType: "2fa_disabled",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
	})

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":            "Two-factor authentication disabled",
			"two_factor_enabled": false,
		},
	})
}
