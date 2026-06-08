package middleware

import (
	"crypto/rand"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/tdaskills/backend/internal/config"
)

// CORSMiddleware handles Cross-Origin Resource Sharing.
func CORSMiddleware(cfg *config.Config) gin.HandlerFunc {
	allowedOrigins := cfg.Admin.CORSOrigins
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"http://localhost:3000"}
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")

		// Check if origin is allowed
		allowed := false
		for _, o := range allowedOrigins {
			if o == origin || o == "*" {
				allowed = true
				break
			}
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-CSRF-Token, X-Requested-With, X-Session-ID")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")
		c.Header("Access-Control-Expose-Headers", "X-Total-Count, X-Request-Id")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// RequestID adds a unique request ID to each request.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-Id")
		if requestID == "" {
			requestID = generateRequestID()
		}
		c.Set("request_id", requestID)
		c.Header("X-Request-Id", requestID)
		c.Next()
	}
}

func generateRequestID() string {
	return time.Now().Format("20060102150405") + "-" + randomString(8)
}

func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		for i := range b {
			b[i] = letters[time.Now().UnixNano()%int64(len(letters))]
		}
		return string(b)
	}
	for i := range b {
		b[i] = letters[int(b[i])%len(letters)]
	}
	return string(b)
}
