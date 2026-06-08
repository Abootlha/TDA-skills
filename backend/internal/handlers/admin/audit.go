package admin

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"

	"github.com/tdaskills/backend/internal/models"
)

type AuditHandler struct {
	db *sqlx.DB
}

func NewAuditHandler(db *sqlx.DB) *AuditHandler {
	return &AuditHandler{db: db}
}

// GET /api/v1/admin/audit-logs
func (h *AuditHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if page < 1 {
		page = 1
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	adminID := c.Query("admin_id")
	action := c.Query("action")
	entityType := c.Query("entity_type")

	query := `SELECT * FROM admin_audit_logs WHERE 1=1`
	countQuery := `SELECT COUNT(*) FROM admin_audit_logs WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if adminID != "" {
		query += ` AND admin_id = $` + strconv.Itoa(argIdx)
		countQuery += ` AND admin_id = $` + strconv.Itoa(argIdx)
		args = append(args, adminID)
		argIdx++
	}
	if action != "" {
		query += ` AND action ILIKE $` + strconv.Itoa(argIdx)
		countQuery += ` AND action ILIKE $` + strconv.Itoa(argIdx)
		args = append(args, "%"+action+"%")
		argIdx++
	}
	if entityType != "" {
		query += ` AND entity_type = $` + strconv.Itoa(argIdx)
		countQuery += ` AND entity_type = $` + strconv.Itoa(argIdx)
		args = append(args, entityType)
		argIdx++
	}

	// Count
	var total int64
	h.db.GetContext(c.Request.Context(), &total, countQuery, args...)

	// Fetch
	query += ` ORDER BY created_at DESC LIMIT $` + strconv.Itoa(argIdx) + ` OFFSET $` + strconv.Itoa(argIdx+1)
	args = append(args, limit, offset)

	var logs []models.AdminAuditLog
	h.db.SelectContext(c.Request.Context(), &logs, query, args...)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"audit_logs": logs,
			"pagination": gin.H{
				"page":       page,
				"limit":      limit,
				"total":      total,
				"total_pages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

// GET /api/v1/admin/login-activity
func (h *AuditHandler) LoginActivity(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if page < 1 {
		page = 1
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	userID := c.Query("user_id")
	eventType := c.Query("event_type")

	query := `SELECT * FROM login_activity WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if userID != "" {
		query += ` AND (user_id = $` + strconv.Itoa(argIdx) + ` OR admin_id = $` + strconv.Itoa(argIdx) + `)`
		args = append(args, userID)
		argIdx++
	}
	if eventType != "" {
		query += ` AND event_type = $` + strconv.Itoa(argIdx)
		args = append(args, eventType)
		argIdx++
	}

	query += ` ORDER BY created_at DESC LIMIT $` + strconv.Itoa(argIdx) + ` OFFSET $` + strconv.Itoa(argIdx+1)
	args = append(args, limit, offset)

	var activities []models.LoginActivity
	h.db.SelectContext(c.Request.Context(), &activities, query, args...)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"login_activity": activities},
	})
}
