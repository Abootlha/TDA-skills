package websocket

import (
	"encoding/json"
	"log"
	"sync"
)

// Message represents a WebSocket message.
type Message struct {
	Event  string          `json:"event"`
	Data   json.RawMessage `json:"data"`
	Room   string          `json:"room,omitempty"`
	UserID string          `json:"user_id,omitempty"`
}

// Hub manages all WebSocket connections, rooms, and broadcasting.
type Hub struct {
	clients    map[string]*Client       // userID -> client
	rooms      map[string]map[*Client]bool // roomName -> set of clients
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

// NewHub creates a new WebSocket hub.
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		rooms:      make(map[string]map[*Client]bool),
		broadcast:  make(chan Message, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Run starts the hub's main event loop.
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.UserID] = client
			// Auto-join private room
			room := "user:" + client.UserID
			if h.rooms[room] == nil {
				h.rooms[room] = make(map[*Client]bool)
			}
			h.rooms[room][client] = true
			h.mu.Unlock()
			log.Printf("WS: Client connected: %s", client.UserID)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.UserID]; ok {
				delete(h.clients, client.UserID)
				// Remove from all rooms
				for room, members := range h.rooms {
					if members[client] {
						delete(members, client)
						if len(members) == 0 {
							delete(h.rooms, room)
						}
					}
				}
				close(client.send)
			}
			h.mu.Unlock()
			log.Printf("WS: Client disconnected: %s", client.UserID)

		case msg := <-h.broadcast:
			h.mu.RLock()
			if msg.Room != "" {
				// Send to room
				if members, ok := h.rooms[msg.Room]; ok {
					for client := range members {
						select {
						case client.send <- msg:
						default:
							close(client.send)
							delete(members, client)
						}
					}
				}
			} else if msg.UserID != "" {
				// Send to specific user
				if client, ok := h.clients[msg.UserID]; ok {
					select {
					case client.send <- msg:
					default:
						close(client.send)
						delete(h.clients, msg.UserID)
					}
				}
			}
			h.mu.RUnlock()
		}
	}
}

// SendToUser sends a message to a specific user.
func (h *Hub) SendToUser(userID string, event string, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return
	}
	h.broadcast <- Message{
		Event:  event,
		Data:   jsonData,
		UserID: userID,
	}
}

// SendToRoom broadcasts a message to a room.
func (h *Hub) SendToRoom(room string, event string, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return
	}
	h.broadcast <- Message{
		Event: event,
		Data:  jsonData,
		Room:  room,
	}
}

// Register adds a client to the hub.
func (h *Hub) Register(client *Client) {
	h.register <- client
}

// Unregister removes a client from the hub.
func (h *Hub) Unregister(client *Client) {
	h.unregister <- client
}

// JoinRoom adds a client to a room.
func (h *Hub) JoinRoom(client *Client, room string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.rooms[room] == nil {
		h.rooms[room] = make(map[*Client]bool)
	}
	h.rooms[room][client] = true
}
