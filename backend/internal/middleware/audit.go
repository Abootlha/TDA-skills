package middleware

import (
	"encoding/json"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// AuditMiddleware logs all admin actions to the admin_audit_logs table.
func AuditMiddleware(db *sqlx.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Only log mutating requests
		method := c.Request.Method
		if method == "GET" || method == "HEAD" || method == "OPTIONS" {
			c.Next()
			return
		}

		c.Next()

		// After handler executes, log the action
		adminID, exists := c.Get("admin_id")
		if !exists {
			return
		}

		adminUUID, err := uuid.Parse(adminID.(string))
		if err != nil {
			return
		}

		var sessionUUID *uuid.UUID
		if sid, ok := c.Get("session_id"); ok {
			if parsed, err := uuid.Parse(sid.(string)); err == nil {
				sessionUUID = &parsed
			}
		}

		action := method + " " + c.FullPath()
		entityType := extractEntityType(c.FullPath())
		var entityID *uuid.UUID
		if idStr := c.Param("id"); idStr != "" {
			if parsed, err := uuid.Parse(idStr); err == nil {
				entityID = &parsed
			}
		}

		ipAddress := c.ClientIP()
		userAgent := c.GetHeader("User-Agent")

		var newValueJSON json.RawMessage
		if c.Request.Body != nil {
			newValueJSON = nil
		}

		query := `INSERT INTO admin_audit_logs 
			(admin_id, session_id, action, entity_type, entity_id, new_value, ip_address, user_agent, created_at) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

		db.ExecContext(c.Request.Context(), query,
			adminUUID, sessionUUID, action, entityType, entityID,
			newValueJSON, ipAddress, userAgent, time.Now(),
		)
	}
}

// extractEntityType derives the entity type from the request path.
func extractEntityType(path string) string {
	parts := []string{}
	for _, p := range splitPath(path) {
		if p != "" && p != "api" && p != "v1" && p != "admin" {
			if _, err := uuid.Parse(p); err != nil {
				parts = append(parts, p)
			}
		}
	}
	if len(parts) > 0 {
		return parts[0]
	}
	return "unknown"
}

func splitPath(path string) []string {
	result := []string{}
	current := ""
	for _, c := range path {
		if c == '/' {
			if current != "" {
				result = append(result, current)
				current = ""
			}
		} else {
			current += string(c)
		}
	}
	if current != "" {
		result = append(result, current)
	}
	return result
}
