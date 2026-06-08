package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	// In production, this uses the R2 client from pkg/cloudflare
}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

// POST /api/v1/upload/presign
func (h *UploadHandler) Presign(c *gin.Context) {
	var req struct {
		FileName    string `json:"file_name" binding:"required"`
		ContentType string `json:"content_type" binding:"required"`
		Folder      string `json:"folder"` // courses/images, users/avatars, etc.
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate content type
	allowed := map[string]bool{
		"image/jpeg":                                  true,
		"image/png":                                   true,
		"image/webp":                                  true,
		"application/pdf":                             true,
		"application/msword":                          true,
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
	}

	if !allowed[req.ContentType] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File type not allowed"})
		return
	}

	// In production, generate R2 presigned URL here
	// For now, return a placeholder
	c.JSON(http.StatusOK, gin.H{
		"upload_url": "https://tdaskills.r2.dev/upload-placeholder",
		"file_key":   req.Folder + "/" + req.FileName,
		"expires_in": 900, // 15 minutes
	})
}
