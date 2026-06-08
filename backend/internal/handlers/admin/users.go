package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/tdaskills/backend/internal/repository"
)

type AdminUserHandler struct {
	userRepo *repository.UserRepository
}

func NewAdminUserHandler(userRepo *repository.UserRepository) *AdminUserHandler {
	return &AdminUserHandler{userRepo: userRepo}
}

// GET /api/v1/admin/users
func (h *AdminUserHandler) List(c *gin.Context) {
	search := c.Query("search")
	page := 1
	limit := 20

	users, total, err := h.userRepo.List(c.Request.Context(), page, limit, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users, "total": total, "page": page, "limit": limit})
}

// GET /api/v1/admin/users/:id
func (h *AdminUserHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.userRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	profile, _ := h.userRepo.GetProfile(c.Request.Context(), id)
	address, _ := h.userRepo.GetAddress(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{"user": user, "profile": profile, "address": address})
}

// PUT /api/v1/admin/users/:id
func (h *AdminUserHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		IsActive *bool `json:"is_active"`
		IsLocked *bool `json:"is_locked"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	isActive := true
	isLocked := false
	if req.IsActive != nil { isActive = *req.IsActive }
	if req.IsLocked != nil { isLocked = *req.IsLocked }

	if err := h.userRepo.UpdateStatus(c.Request.Context(), id, isActive, isLocked); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated"})
}
