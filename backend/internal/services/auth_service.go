package services

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
	"github.com/tdaskills/backend/internal/middleware"
	"github.com/tdaskills/backend/internal/models"
	"github.com/tdaskills/backend/internal/repository"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrEmailTaken         = errors.New("email already registered")
	ErrAccountLocked      = errors.New("account temporarily locked")
	ErrAccountInactive    = errors.New("account is inactive")
	ErrInvalidToken       = errors.New("invalid or expired token")
)

type AuthService struct {
	userRepo      *repository.UserRepository
	adminRepo     *repository.AdminRepository
	redis         *database.RedisClient
	cfg           *config.Config
	cryptoService *CryptoService
}

func NewAuthService(userRepo *repository.UserRepository, adminRepo *repository.AdminRepository, redis *database.RedisClient, cfg *config.Config, cryptoService *CryptoService) *AuthService {
	return &AuthService{userRepo: userRepo, adminRepo: adminRepo, redis: redis, cfg: cfg, cryptoService: cryptoService}
}

// Register creates a new learner account.
func (s *AuthService) Register(ctx context.Context, req *models.RegisterRequest) (*models.AuthResponse, error) {
	// Check if email exists
	existing, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if existing != nil {
		return nil, ErrEmailTaken
	}

	// Hash password (bcrypt cost 12)
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        req.Email,
		PasswordHash: string(hash),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Phone:        sql.NullString{String: req.Phone, Valid: req.Phone != ""},
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Generate tokens
	accessToken, expiresIn, err := s.generateAccessToken(user.ID.String(), user.Email, "learner")
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken(ctx, user.ID, "", "", nil, false)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
		User:         user,
	}, nil
}

// Login authenticates a learner.
func (s *AuthService) Login(ctx context.Context, req *models.LoginRequest, ipAddress, userAgent string) (*models.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, ErrAccountInactive
	}

	if user.IsLocked && user.LockedUntil != nil && user.LockedUntil.After(time.Now()) {
		return nil, ErrAccountLocked
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		// Increment login attempts
		attempts := user.LoginAttempts + 1
		var lockUntil *time.Time
		if attempts >= 5 {
			t := time.Now().Add(15 * time.Minute)
			lockUntil = &t
		}
		s.userRepo.UpdateLoginAttempts(ctx, user.ID, attempts, lockUntil)
		return nil, ErrInvalidCredentials
	}

	// Check if 2FA is required
	twoFA, err := s.userRepo.GetTwoFactorSecret(ctx, user.ID)
	if err == nil && twoFA != nil && twoFA.IsEnabled {
		return &models.AuthResponse{
			Requires2FA: true,
			UserID:      user.ID.String(),
			Method:      "totp",
		}, nil
	}

	// Reset login attempts and update last login
	s.userRepo.UpdateLastLogin(ctx, user.ID)

	accessToken, expiresIn, err := s.generateAccessToken(user.ID.String(), user.Email, "learner")
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken(ctx, user.ID, ipAddress, userAgent, req.DeviceInfo, false)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
		User:         user,
	}, nil
}

// AdminLogin authenticates an admin user.
func (s *AuthService) AdminLogin(ctx context.Context, req *models.AdminLoginRequest) (*models.AdminAuthResponse, error) {
	admin, err := s.adminRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	s.adminRepo.UpdateLastLogin(ctx, admin.ID)

	accessToken, expiresIn, err := s.generateAccessToken(admin.ID.String(), admin.Email, admin.Role)
	if err != nil {
		return nil, err
	}

	return &models.AdminAuthResponse{
		AccessToken: accessToken,
		ExpiresIn:   expiresIn,
		Admin:       admin,
	}, nil
}

// RefreshAccessToken generates a new access token from a valid refresh token.
func (s *AuthService) RefreshAccessToken(ctx context.Context, refreshTokenStr string, ipAddress, userAgent string) (*models.AuthResponse, error) {
	tokenHash := hashToken(refreshTokenStr)

	rt, err := s.userRepo.GetRefreshToken(ctx, tokenHash)
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Revoke old token (rotation)
	s.userRepo.RevokeRefreshToken(ctx, tokenHash)

	user, err := s.userRepo.GetByID(ctx, rt.UserID)
	if err != nil {
		return nil, err
	}

	accessToken, expiresIn, err := s.generateAccessToken(user.ID.String(), user.Email, "learner")
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := s.generateRefreshToken(ctx, user.ID, ipAddress, userAgent, rt.DeviceInfo, false)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    expiresIn,
		User:         user,
	}, nil
}

// Logout invalidates the user's session and refresh tokens.
func (s *AuthService) Logout(ctx context.Context, userID string, accessToken string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return err
	}

	// Revoke all refresh tokens
	s.userRepo.RevokeAllUserTokens(ctx, uid)

	// Blacklist access token in Redis
	s.redis.Set(ctx, "blacklist:"+accessToken, "1", s.cfg.JWT.AccessExpiry)

	return nil
}

// IsTokenBlacklisted checks if an access token has been invalidated.
func (s *AuthService) IsTokenBlacklisted(ctx context.Context, token string) bool {
	exists, _ := s.redis.Exists(ctx, "blacklist:"+token)
	return exists
}

// --- Internal helpers ---

func (s *AuthService) generateAccessToken(userID, email, role string) (string, int64, error) {
	expiry := time.Now().Add(s.cfg.JWT.AccessExpiry)
	claims := &middleware.Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "tdaskills",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return "", 0, err
	}

	return tokenStr, int64(s.cfg.JWT.AccessExpiry.Seconds()), nil
}

func (s *AuthService) generateRefreshToken(ctx context.Context, userID uuid.UUID, ipAddress, userAgent string, deviceInfo json.RawMessage, twoFactorVerified bool) (string, error) {
	tokenID := uuid.New().String()
	tokenHash := hashToken(tokenID)
	expiresAt := time.Now().Add(s.cfg.JWT.RefreshExpiry)

	rt := &models.RefreshToken{
		UserID:     userID,
		TokenHash:  tokenHash,
		DeviceInfo: deviceInfo,
		IPAddress:  sql.NullString{String: ipAddress, Valid: ipAddress != ""},
		ExpiresAt:  expiresAt,
	}

	if err := s.userRepo.CreateRefreshToken(ctx, rt); err != nil {
		return "", err
	}

	// Create a UserSession matching the refresh token session
	session := &models.UserSession{
		UserID:            userID,
		TokenHash:         tokenHash,
		IPAddress:         sql.NullString{String: ipAddress, Valid: ipAddress != ""},
		UserAgent:         sql.NullString{String: userAgent, Valid: userAgent != ""},
		DeviceInfo:        deviceInfo,
		TwoFactorVerified: twoFactorVerified,
		ExpiresAt:         expiresAt,
	}

	if err := s.userRepo.CreateUserSession(ctx, session); err != nil {
		log.Printf("Warning: failed to create user session in generateRefreshToken: %v", err)
	}

	return tokenID, nil
}

// ComparePassword compares a bcrypt hashed password with its plaintext equivalent.
func ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func (s *AuthService) Verify2FA(ctx context.Context, userID uuid.UUID, code string, ipAddress, userAgent string) (*models.AuthResponse, error) {
	twoFA, err := s.userRepo.GetTwoFactorSecret(ctx, userID)
	if err != nil || twoFA == nil || !twoFA.IsEnabled {
		return nil, errors.New("2FA is not enabled")
	}

	if !s.cryptoService.VerifyTOTP(twoFA.Secret, code) {
		return nil, errors.New("invalid code")
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	accessToken, expiresIn, err := s.generateAccessToken(user.ID.String(), user.Email, "learner")
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken(ctx, user.ID, ipAddress, userAgent, nil, true)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
		User:         user,
	}, nil
}

func (s *AuthService) UseBackupCode(ctx context.Context, userID uuid.UUID, backupCode string, ipAddress, userAgent string) (*models.AuthResponse, int, error) {
	twoFA, err := s.userRepo.GetTwoFactorSecret(ctx, userID)
	if err != nil || twoFA == nil || !twoFA.IsEnabled {
		return nil, 0, errors.New("2FA is not enabled")
	}

	var hashedCodes []string
	if err := json.Unmarshal(twoFA.BackupCodes, &hashedCodes); err != nil {
		return nil, 0, err
	}

	matchedIdx := s.cryptoService.VerifyBackupCode(backupCode, hashedCodes)
	if matchedIdx == -1 {
		return nil, 0, errors.New("invalid backup code")
	}

	// Remove the used backup code
	hashedCodes = append(hashedCodes[:matchedIdx], hashedCodes[matchedIdx+1:]...)
	updatedCodes, err := json.Marshal(hashedCodes)
	if err != nil {
		return nil, 0, err
	}

	if err := s.userRepo.UpsertTwoFactorSecret(ctx, userID, twoFA.Secret, updatedCodes); err != nil {
		return nil, 0, err
	}

	if err := s.userRepo.EnableTwoFactor(ctx, userID); err != nil {
		return nil, 0, err
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, 0, err
	}

	accessToken, expiresIn, err := s.generateAccessToken(user.ID.String(), user.Email, "learner")
	if err != nil {
		return nil, 0, err
	}

	refreshToken, err := s.generateRefreshToken(ctx, user.ID, ipAddress, userAgent, nil, true)
	if err != nil {
		return nil, 0, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
		User:         user,
	}, len(hashedCodes), nil
}

func (s *AuthService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	return s.userRepo.GetByEmail(ctx, email)
}

func (s *AuthService) GetUserByID(ctx context.Context, idStr string) (*models.User, error) {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return nil, err
	}
	return s.userRepo.GetByID(ctx, id)
}

func (s *AuthService) ResetPassword(ctx context.Context, userID uuid.UUID, password string) error {
	if err := s.userRepo.UpdatePassword(ctx, userID, password); err != nil {
		return err
	}
	return s.userRepo.RevokeAllSessions(ctx, userID)
}

func hashToken(token string) string {
	h := sha256.Sum256([]byte(token))
	return hex.EncodeToString(h[:])
}
