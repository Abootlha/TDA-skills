package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

func encryptSecret(payload, masterSecret string) string {
	key := sha256.Sum256([]byte(masterSecret))
	block, _ := aes.NewCipher(key[:])
	gcm, _ := cipher.NewGCM(block)
	nonce := make([]byte, gcm.NonceSize())
	rand.Read(nonce)
	ciphertext := gcm.Seal(nonce, nonce, []byte(payload), nil)
	return hex.EncodeToString(ciphertext)
}

func main() {
	adminSecret := "a8b3c9f2-7d4e-41a5-92b8-f1e0d3c7a9b6"
	email := "test@test.com"
	payload := fmt.Sprintf("%s|%s", adminSecret, email)
	fmt.Println(encryptSecret(payload, adminSecret))
}
