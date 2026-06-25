package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UploadHandler struct {
	// In production, this uses the R2 client from pkg/cloudflare
}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

// POST /api/v1/upload/image (Multipart form)
func (h *UploadHandler) UploadImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image file provided"})
		return
	}
	defer file.Close()

	// Ensure uploads directory exists
	uploadDir := "uploads/images"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%s_%d%s", uuid.New().String()[:8], time.Now().Unix(), ext)
	filePath := filepath.Join(uploadDir, filename)

	// Save file
	out, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image content"})
		return
	}

	// Determine host URL (fallback to localhost:8080 if not set)
	baseURL := "http://localhost:8080"
	if host := c.Request.Header.Get("X-Forwarded-Host"); host != "" {
		baseURL = "https://" + host
	} else if host := c.Request.Host; host != "" {
		baseURL = "http://" + host
	}

	imageURL := fmt.Sprintf("%s/uploads/images/%s", baseURL, filename)

	c.JSON(http.StatusOK, gin.H{
		"message":   "Image uploaded successfully",
		"image_url": imageURL,
	})
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
