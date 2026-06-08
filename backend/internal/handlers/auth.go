package handlers

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/services"
)

type AuthHandler struct {
	authService   *services.AuthService
	cryptoService *services.CryptoService
	emailService  *services.EmailService
}

func NewAuthHandler(authService *services.AuthService, cryptoService *services.CryptoService, emailService *services.EmailService) *AuthHandler {
	return &AuthHandler{authService: authService, cryptoService: cryptoService, emailService: emailService}
}

// POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Validate password strength
	if err := h.cryptoService.ValidatePasswordStrength(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "WEAK_PASSWORD", "message": err.Error()}})
		return
	}

	resp, err := h.authService.Register(c.Request.Context(), &req)
	if err != nil {
		switch err {
		case services.ErrEmailTaken:
			c.JSON(http.StatusConflict, gin.H{"success": false, "error": gin.H{"code": "EMAIL_EXISTS", "message": "An account with this email already exists"}})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Registration failed"}})
		}
		return
	}

	// Generate email verification token
	_, _ = h.cryptoService.CreateEmailVerificationToken(c.Request.Context(), resp.User.ID.String())

	// Set refresh token as httpOnly cookie
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "", true, true)

	resp.EmailVerificationRequired = true

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    resp,
	})
}

// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	resp, err := h.authService.Login(c.Request.Context(), &req, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		switch err {
		case services.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}})
		case services.ErrAccountLocked:
			c.JSON(http.StatusForbidden, gin.H{"success": false, "error": gin.H{"code": "ACCOUNT_LOCKED", "message": "Account locked. Try again after 30 minutes or use password reset"}})
		case services.ErrAccountInactive:
			c.JSON(http.StatusForbidden, gin.H{"success": false, "error": gin.H{"code": "FORBIDDEN", "message": "Account is deactivated"}})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Login failed"}})
		}
		return
	}

	// Log login activity
	if resp.User != nil {
		h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
			UserID:     &resp.User.ID,
			EventType:  "login_success",
			IPAddress:  sql.NullString{String: c.ClientIP(), Valid: true},
			UserAgent:  sql.NullString{String: c.GetHeader("User-Agent"), Valid: true},
			DeviceInfo: req.DeviceInfo,
		})
	}

	// Check if 2FA is required
	if resp.Requires2FA {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"requires_2fa": true,
				"user_id":      resp.UserID,
				"method":       resp.Method,
			},
		})
		return
	}

	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{"success": true, "data": resp})
}

// POST /api/v1/auth/verify-2fa
func (h *AuthHandler) Verify2FA(c *gin.Context) {
	var req models.Verify2FARequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	uid, err := uuid.Parse(req.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid user ID"}})
		return
	}

	resp, err := h.authService.Verify2FA(c.Request.Context(), uid, req.Code, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
			UserID:    &uid,
			EventType: "2fa_failed",
			IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
		})
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "INVALID_2FA_CODE", "message": "Invalid verification code"}})
		return
	}

	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{"success": true, "data": resp})
}

// POST /api/v1/auth/2fa/backup-code
func (h *AuthHandler) UseBackupCode(c *gin.Context) {
	var req models.BackupCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	uid, err := uuid.Parse(req.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid user ID"}})
		return
	}

	resp, remaining, err := h.authService.UseBackupCode(c.Request.Context(), uid, req.BackupCode, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "INVALID_2FA_CODE", "message": "Invalid backup code"}})
		return
	}

	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user":                  resp.User,
			"access_token":          resp.AccessToken,
			"refresh_token":         resp.RefreshToken,
			"backup_code_used":      true,
			"backup_codes_remaining": remaining,
		},
	})
}

// POST /api/v1/auth/refresh
func (h *AuthHandler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil || refreshToken == "" {
		var body struct {
			RefreshToken string `json:"refresh_token"`
		}
		if c.ShouldBindJSON(&body) != nil || body.RefreshToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "TOKEN_EXPIRED", "message": "Session expired, please login again"}})
			return
		}
		refreshToken = body.RefreshToken
	}

	resp, err := h.authService.RefreshAccessToken(c.Request.Context(), refreshToken, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "TOKEN_EXPIRED", "message": "Session expired, please login again"}})
		return
	}

	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token": resp.AccessToken,
			"expires_in":   resp.ExpiresIn,
		},
	})
}

// POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"code": "UNAUTHORIZED", "message": "Not authenticated"}})
		return
	}

	authHeader := c.GetHeader("Authorization")
	token := ""
	if parts := strings.SplitN(authHeader, " ", 2); len(parts) == 2 {
		token = parts[1]
	}

	h.authService.Logout(c.Request.Context(), userID, token)

	// Log activity
	uid, _ := uuid.Parse(userID)
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		UserID:    &uid,
		EventType: "logout",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
	})

	c.SetCookie("refresh_token", "", -1, "/", "", true, true)
	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"message": "Logged out"}})
}

// GET /api/v1/auth/me
func (h *AuthHandler) GetMe(c *gin.Context) {
	userID := middleware.GetUserID(c)
	uid, _ := uuid.Parse(userID)
	_ = uid

	claims, _ := c.Get("claims")
	cl := claims.(*middleware.Claims)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user_id": cl.UserID,
			"email":   cl.Email,
			"role":    cl.Role,
		},
	})
}

// --- Email Verification ---

// GET /api/v1/auth/verify-email-page?token=xxx
func (h *AuthHandler) VerifyEmailPage(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Verification link is invalid or has expired"}})
		return
	}

	evt, err := h.cryptoService.VerifyEmailToken(c.Request.Context(), token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Verification link is invalid or has expired"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"valid":   true,
			"user_id": evt.UserID,
		},
	})
}

// POST /api/v1/auth/verify-email
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req models.VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	evt, err := h.cryptoService.VerifyEmailToken(c.Request.Context(), req.Token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Verification link is invalid or has expired"}})
		return
	}

	if err := h.cryptoService.MarkEmailVerified(c.Request.Context(), evt.ID.String(), evt.UserID.String()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to verify email"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":        "Email verified successfully",
			"email_verified": true,
		},
	})
}

// --- Password Reset ---

// POST /api/v1/auth/forgot-password
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Always return same response to prevent email enumeration
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "If an account with that email exists, we've sent a password reset link",
		},
	})

	// Process in background
	go func() {
		user, err := h.authService.GetUserByEmail(c.Request.Context(), req.Email)
		if err != nil || user == nil {
			return
		}

		token, err := h.cryptoService.CreatePasswordResetToken(c.Request.Context(), user.ID.String(), c.ClientIP(), c.GetHeader("User-Agent"))
		if err != nil {
			return
		}

		h.emailService.SendTemplatedEmail(user.Email, "password_reset", "Reset your password - TDA Skills", map[string]string{
			"FirstName": user.FirstName,
			"ResetURL":  "https://tdaskills.co.uk/reset-password?token=" + token,
		})
	}()
}

// GET /api/v1/auth/reset-password-page?token=xxx
func (h *AuthHandler) ResetPasswordPage(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Reset link is invalid or has expired"}})
		return
	}

	prt, err := h.cryptoService.VerifyPasswordResetToken(c.Request.Context(), token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Reset link is invalid or has expired"}})
		return
	}

	// Mask email
	user, _ := h.authService.GetUserByID(c.Request.Context(), prt.UserID.String())
	maskedEmail := ""
	if user != nil {
		parts := strings.SplitN(user.Email, "@", 2)
		if len(parts) == 2 {
			name := parts[0]
			if len(name) > 1 {
				maskedEmail = string(name[0]) + strings.Repeat("*", len(name)-1) + "@" + parts[1]
			} else {
				maskedEmail = "*@" + parts[1]
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"valid":        true,
			"email_masked": maskedEmail,
		},
	})
}

// POST /api/v1/auth/reset-password
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "VALIDATION_ERROR", "message": "Invalid request body"}})
		return
	}

	// Validate password strength
	if err := h.cryptoService.ValidatePasswordStrength(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "WEAK_PASSWORD", "message": err.Error()}})
		return
	}

	prt, err := h.cryptoService.VerifyPasswordResetToken(c.Request.Context(), req.Token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "INVALID_TOKEN", "message": "Reset link is invalid or has expired"}})
		return
	}

	// Update password
	if err := h.authService.ResetPassword(c.Request.Context(), prt.UserID, req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to reset password"}})
		return
	}

	// Revoke reset token
	h.cryptoService.RevokePasswordResetToken(c.Request.Context(), prt.ID.String())

	// Log activity
	h.cryptoService.LogLoginActivity(c.Request.Context(), &models.LoginActivity{
		UserID:    &prt.UserID,
		EventType: "password_changed",
		IPAddress: sql.NullString{String: c.ClientIP(), Valid: true},
	})

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":              "Password reset successful. Please login with your new password.",
			"all_sessions_revoked": true,
		},
	})
}






