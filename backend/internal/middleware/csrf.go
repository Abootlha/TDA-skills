package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CSRFMiddleware provides CSRF token generation and validation.
func CSRFMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip CSRF for safe methods and webhooks
		if c.Request.Method == "GET" || c.Request.Method == "HEAD" || c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		// Skip for API routes that use Bearer auth (JWT already prevents CSRF)
		if c.GetHeader("Authorization") != "" {
			c.Next()
			return
		}

		// Validate CSRF token for cookie-based sessions
		token := c.GetHeader("X-CSRF-Token")
		if token == "" {
			token = c.PostForm("_csrf")
		}

		cookieToken, err := c.Cookie("csrf_token")
		if err != nil || token == "" || token != cookieToken {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid CSRF token"})
			return
		}

		c.Next()
	}
}

// SetCSRFToken generates and sets a CSRF token cookie.
func SetCSRFToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, err := c.Cookie("csrf_token"); err != nil {
			token := generateCSRFToken()
			c.SetCookie("csrf_token", token, 86400, "/", "", true, false)
			c.Set("csrf_token", token)
		}
		c.Next()
	}
}

func generateCSRFToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
