package middleware

import "github.com/gin-gonic/gin"

// SecurityHeaders adds production-grade security headers to all responses.
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com; style-src 'self' 'unsafe-inline';")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		c.Header("X-Permitted-Cross-Domain-Policies", "none")
		c.Next()
	}
}
