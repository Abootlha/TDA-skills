package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all application configuration.
type Config struct {
	Server     ServerConfig
	Database   DatabaseConfig
	Redis      RedisConfig
	JWT        JWTConfig
	Stripe     StripeConfig
	PayPal     PayPalConfig
	Cloudflare CloudflareConfig
	SMTP       SMTPConfig
	Admin      AdminConfig
	WebSocket  WebSocketConfig
	Security   SecurityConfig
	Email      EmailConfig
	AntiScrap  AntiScrapConfig
}

type ServerConfig struct {
	Port    string
	GinMode string
	Env     string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	DB       string
	User     string
	Password string
	MaxConn  int
	IdleConn int
	SSLMode  string
}

func (d DatabaseConfig) DSN() string {
	return "host=" + d.Host +
		" port=" + d.Port +
		" user=" + d.User +
		" password=" + d.Password +
		" dbname=" + d.DB +
		" sslmode=" + d.SSLMode
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

func (r RedisConfig) Addr() string {
	return r.Host + ":" + r.Port
}

type JWTConfig struct {
	Secret        string
	AccessExpiry  time.Duration
	RefreshExpiry time.Duration
	Issuer        string
}

type StripeConfig struct {
	SecretKey      string
	WebhookSecret  string
	PublishableKey string
}

type PayPalConfig struct {
	ClientID string
	Secret   string
	Env      string // sandbox or live
}

type CloudflareConfig struct {
	AccountID   string
	R2AccessKey string
	R2SecretKey string
	R2Bucket    string
	R2PublicURL string
	R2Endpoint  string
}

type SMTPConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	TLS             bool
	TLSInsecureSkip bool
	FromName        string
	FromEmail       string
	ReplyTo         string
}

type AdminConfig struct {
	IPWhitelist []string
	CORSOrigins []string
}

type WebSocketConfig struct {
	Port string
}

type SecurityConfig struct {
	MaxLoginAttempts       int
	LockoutDurationMinutes int
	SessionTimeoutMinutes  int
	PasswordMinLength      int
	PasswordRequireUpper   bool
	PasswordRequireLower   bool
	PasswordRequireDigit   bool
	PasswordRequireSpecial bool
}

type EmailConfig struct {
	VerificationEnabled    bool
	PasswordResetEnabled   bool
	TwoFactorRequiredAdmin bool
	TwoFactorRequiredUsers bool
}

type AntiScrapConfig struct {
	Enabled           bool
	HoneypotRoutes    []string
	BlockedUserAgents []string
	RateLimitAuth     int
	RateLimitAPI      int
	RateLimitSearch   int
}

// Load reads environment variables and returns a Config struct.
func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Port:    getEnv("PORT", "8080"),
			GinMode: getEnv("GIN_MODE", "debug"),
			Env:     getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("POSTGRES_HOST", "localhost"),
			Port:     getEnv("POSTGRES_PORT", "5432"),
			DB:       getEnv("POSTGRES_DB", "tdaskills"),
			User:     getEnv("POSTGRES_USER", "tdaskills"),
			Password: os.Getenv("POSTGRES_PASSWORD"),
			MaxConn:  getEnvInt("POSTGRES_MAX_CONN", 25),
			IdleConn: getEnvInt("POSTGRES_IDLE_CONN", 5),
			SSLMode:  getEnv("POSTGRES_SSL_MODE", "disable"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvInt("REDIS_DB", 0),
		},
		JWT: JWTConfig{
			Secret:        os.Getenv("JWT_SECRET"),
			AccessExpiry:  getEnvDuration("JWT_ACCESS_EXPIRY", 15*time.Minute),
			RefreshExpiry: getEnvDuration("JWT_REFRESH_EXPIRY", 168*time.Hour),
			Issuer:        getEnv("JWT_ISSUER", "tdaskills"),
		},
		Stripe: StripeConfig{
			SecretKey:      os.Getenv("STRIPE_SECRET_KEY"),
			WebhookSecret:  os.Getenv("STRIPE_WEBHOOK_SECRET"),
			PublishableKey: getEnv("STRIPE_PUBLISHABLE_KEY", ""),
		},
		PayPal: PayPalConfig{
			ClientID: getEnv("PAYPAL_CLIENT_ID", ""),
			Secret:   os.Getenv("PAYPAL_SECRET"),
			Env:      getEnv("PAYPAL_ENV", "sandbox"),
		},
		Cloudflare: CloudflareConfig{
			AccountID:   getEnv("CLOUDFLARE_ACCOUNT_ID", ""),
			R2AccessKey: getEnv("CLOUDFLARE_R2_ACCESS_KEY", ""),
			R2SecretKey: os.Getenv("CLOUDFLARE_R2_SECRET_KEY"),
			R2Bucket:    getEnv("CLOUDFLARE_R2_BUCKET", "tdaskills"),
			R2PublicURL: getEnv("CLOUDFLARE_R2_PUBLIC_URL", ""),
			R2Endpoint:  getEnv("CLOUDFLARE_R2_ENDPOINT", ""),
		},
		SMTP: SMTPConfig{
			Host:            getEnv("SMTP_HOST", ""),
			Port:            getEnvInt("SMTP_PORT", 587),
			User:            getEnv("SMTP_USER", ""),
			Password:        getEnv("SMTP_PASSWORD", ""),
			TLS:             getEnvBool("SMTP_TLS", true),
			TLSInsecureSkip: getEnvBool("SMTP_TLS_INSECURE_SKIP", false),
			FromName:        getEnv("EMAIL_FROM_NAME", "TDA Skills"),
			FromEmail:       getEnv("EMAIL_FROM_ADDRESS", "noreply@tdaskills.co.uk"),
			ReplyTo:         getEnv("EMAIL_REPLY_TO", "support@tdaskills.co.uk"),
		},
		Admin: AdminConfig{
			IPWhitelist: getEnvSlice("ADMIN_IP_WHITELIST", ","),
			CORSOrigins: getEnvSlice("CORS_ORIGINS", ","),
		},
		WebSocket: WebSocketConfig{
			Port: getEnv("WS_PORT", "8081"),
		},
		Security: SecurityConfig{
			MaxLoginAttempts:       getEnvInt("MAX_LOGIN_ATTEMPTS", 5),
			LockoutDurationMinutes: getEnvInt("LOCKOUT_DURATION_MINUTES", 30),
			SessionTimeoutMinutes:  getEnvInt("SESSION_TIMEOUT_MINUTES", 60),
			PasswordMinLength:      getEnvInt("PASSWORD_MIN_LENGTH", 8),
			PasswordRequireUpper:   getEnvBool("PASSWORD_REQUIRE_UPPERCASE", true),
			PasswordRequireLower:   getEnvBool("PASSWORD_REQUIRE_LOWERCASE", true),
			PasswordRequireDigit:   getEnvBool("PASSWORD_REQUIRE_DIGIT", true),
			PasswordRequireSpecial: getEnvBool("PASSWORD_REQUIRE_SPECIAL", true),
		},
		Email: EmailConfig{
			VerificationEnabled:    getEnvBool("EMAIL_VERIFICATION_ENABLED", true),
			PasswordResetEnabled:   getEnvBool("PASSWORD_RESET_ENABLED", true),
			TwoFactorRequiredAdmin: getEnvBool("TWO_FACTOR_REQUIRED_FOR_ADMIN", false),
			TwoFactorRequiredUsers: getEnvBool("TWO_FACTOR_REQUIRED_FOR_USERS", false),
		},
		AntiScrap: AntiScrapConfig{
			Enabled:           getEnvBool("ANTI_SCRAP_ENABLED", true),
			HoneypotRoutes:    getEnvSlice("HONEYPOT_ROUTES", ","),
			BlockedUserAgents: getEnvSlice("BLOCKED_USER_AGENTS", ","),
			RateLimitAuth:     getEnvInt("RATE_LIMIT_AUTH", 5),
			RateLimitAPI:      getEnvInt("RATE_LIMIT_API", 60),
			RateLimitSearch:   getEnvInt("RATE_LIMIT_SEARCH", 10),
		},
	}
}

// Helper functions

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return defaultVal
	}
	return i
}

func getEnvBool(key string, defaultVal bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return defaultVal
	}
	return b
}

func getEnvDuration(key string, defaultVal time.Duration) time.Duration {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return defaultVal
	}
	return d
}

func getEnvSlice(key, sep string) []string {
	val := os.Getenv(key)
	if val == "" {
		return []string{}
	}
	parts := strings.Split(val, sep)
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
