package main

import (
	"encoding/json"
	"fmt"
)

type CartItem struct {
	ID string `json:"id"`
}

type CheckoutDraft struct {
	FirstName *string     `json:"firstName,omitempty"`
	LastName  *string     `json:"lastName,omitempty"`
	CartItems *[]CartItem `json:"cartItems,omitempty"`
}

func main() {
	var incoming CheckoutDraft
	payload := `{"cartItems": [{"id": "123"}]}`
	json.Unmarshal([]byte(payload), &incoming)
	
	fmt.Printf("FirstName: %v\n", incoming.FirstName)
	fmt.Printf("CartItems: %v\n", incoming.CartItems)
}
