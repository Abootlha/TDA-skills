package websocket

import (
	"encoding/json"
	"log"
	"time"

	ws "github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = 30 * time.Second
	maxMessageSize = 4096
)

// Client represents a single WebSocket connection.
type Client struct {
	hub    *Hub
	conn   *ws.Conn
	send   chan Message
	UserID string
}

// NewClient creates a new WebSocket client.
func NewClient(hub *Hub, conn *ws.Conn, userID string) *Client {
	return &Client{
		hub:    hub,
		conn:   conn,
		send:   make(chan Message, 256),
		UserID: userID,
	}
}

// ReadPump reads messages from the WebSocket connection.
func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, msgBytes, err := c.conn.ReadMessage()
		if err != nil {
			if ws.IsUnexpectedCloseError(err, ws.CloseGoingAway, ws.CloseAbnormalClosure) {
				log.Printf("WS read error: %v", err)
			}
			break
		}

		var msg Message
		if err := json.Unmarshal(msgBytes, &msg); err != nil {
			continue
		}

		msg.UserID = c.UserID

		// Handle incoming messages (e.g., chat)
		switch msg.Event {
		case "chat:message":
			c.hub.broadcast <- msg
		}
	}
}

// WritePump writes messages to the WebSocket connection.
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(ws.CloseMessage, []byte{})
				return
			}

			data, err := json.Marshal(msg)
			if err != nil {
				continue
			}

			if err := c.conn.WriteMessage(ws.TextMessage, data); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(ws.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
