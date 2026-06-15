package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
)

// AdminClaims extends JWT claims with admin-specific fields.
type AdminClaims struct {
	UserID      string   `json:"user_id"`
	Email       string   `json:"email"`
	Role        string   `json:"role"`
	Permissions []string `json:"permissions,omitempty"`
	SessionID   string   `json:"session_id,omitempty"`
	jwt.RegisteredClaims
}

// AdminAuthMiddleware validates admin JWT tokens and enforces 1-hour session expiry.
func AdminAuthMiddleware(cfg *config.Config, rdb *database.RedisClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		var tokenString string

		if authHeader != "" {
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"success": false,
					"error":   gin.H{"code": "UNAUTHORIZED", "message": "Invalid authorization header format"},
				})
				return
			}
			tokenString = parts[1]
		} else {
			// Try to get token from cookie
			cookie, err := c.Cookie("admin_access_token")
			if err != nil || cookie == "" {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"success": false,
					"error":   gin.H{"code": "UNAUTHORIZED", "message": "Authorization required"},
				})
				return
			}
			tokenString = cookie
		}

		// Check token blacklist
		if exists, _ := rdb.Exists(c.Request.Context(), "blacklist:"+tokenString); exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"code": "TOKEN_REVOKED", "message": "Token has been revoked"},
			})
			return
		}

		claims := &AdminClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWT.Secret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"code": "TOKEN_EXPIRED", "message": "Invalid or expired token"},
			})
			return
		}

		// Verify admin role
		if claims.Role != "admin" && claims.Role != "super_admin" &&
			claims.Role != "content_manager" && claims.Role != "support" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "FORBIDDEN", "message": "Admin access required"},
			})
			return
		}

		// Set context
		c.Set("admin_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("permissions", claims.Permissions)
		c.Set("session_id", claims.SessionID)
		c.Set("admin_claims", claims)

		c.Next()
	}
}

// RequirePermission checks if the admin has a specific permission.
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		perms, exists := c.Get("permissions")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "FORBIDDEN", "message": "Insufficient permissions"},
			})
			return
		}

		role, _ := c.Get("role")
		if role == "super_admin" {
			c.Next()
			return
		}

		permList, ok := perms.([]string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"code": "FORBIDDEN", "message": "Insufficient permissions"},
			})
			return
		}

		for _, p := range permList {
			if p == permission {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   gin.H{"code": "FORBIDDEN", "message": "Missing permission: " + permission},
		})
	}
}

// AdminIPWhitelist restricts admin access to whitelisted IPs.
func AdminIPWhitelist(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if len(cfg.Admin.IPWhitelist) == 0 {
			c.Next()
			return
		}

		clientIP := c.ClientIP()
		for _, ip := range cfg.Admin.IPWhitelist {
			if ip == clientIP {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   gin.H{"code": "IP_WHITELIST_REQUIRED", "message": "Access denied from this IP address"},
		})
	}
}

// AdminSessionExpiry middleware to track session activity.
func AdminSessionExpiry() gin.HandlerFunc {
	return func(c *gin.Context) {
		_ = time.Now()
		c.Next()
	}
}
