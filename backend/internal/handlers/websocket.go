package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	ws "github.com/gorilla/websocket"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/middleware"
	wsHub "github.com/tdaskills/backend/internal/websocket"
)

var upgrader = ws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, validate origin
	},
}

type WebSocketHandler struct {
	hub *wsHub.Hub
	cfg *config.Config
}

func NewWebSocketHandler(hub *wsHub.Hub, cfg *config.Config) *WebSocketHandler {
	return &WebSocketHandler{hub: hub, cfg: cfg}
}

// GET /ws?token=<jwt>
func (h *WebSocketHandler) HandleConnect(c *gin.Context) {
	tokenStr := c.Query("token")
	if tokenStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
		return
	}

	// Validate JWT
	claims := &middleware.Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(h.cfg.JWT.Secret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Upgrade to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	client := wsHub.NewClient(h.hub, conn, claims.UserID)
	h.hub.Register(client)

	go client.WritePump()
	go client.ReadPump()
}
