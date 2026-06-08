package main

import (
	"encoding/json"
	"fmt"
)

type CartItem struct {
	ID    string  `json:"id"`
	Title string  `json:"title"`
	Price float64 `json:"price"`
	Type  string  `json:"type,omitempty"`
}

type CheckoutDraft struct {
	FirstName *string     `json:"firstName,omitempty"`
	LastName  *string     `json:"lastName,omitempty"`
	Email     *string     `json:"email,omitempty"`
	Phone     *string     `json:"phone,omitempty"`
	DOB       *string     `json:"dob,omitempty"`
	CartItems *[]CartItem `json:"cartItems,omitempty"`
}

func main() {
	var draft CheckoutDraft
	payload := `{"cartItems": [{"id": "operative", "title": "Operative Test", "price": 22.5, "type": "test"}]}`
	json.Unmarshal([]byte(payload), &draft)
	
	out, _ := json.Marshal(draft)
	fmt.Println(string(out))
}
