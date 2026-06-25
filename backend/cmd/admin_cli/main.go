package main

import (
	"bufio"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
)

func encryptSecret(secret string) string {
	key := sha256.Sum256([]byte(secret))
	block, _ := aes.NewCipher(key[:])
	gcm, _ := cipher.NewGCM(block)
	nonce := make([]byte, gcm.NonceSize())
	rand.Read(nonce)
	ciphertext := gcm.Seal(nonce, nonce, []byte(secret), nil)
	return hex.EncodeToString(ciphertext)
}

func findEnvFile() string {
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}
	for {
		path := filepath.Join(dir, ".env")
		if _, err := os.Stat(path); err == nil {
			return path
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return ""
}

func main() {
	flag.Parse()

	// Load .env
	envPath := findEnvFile()
	if envPath != "" {
		if err := godotenv.Load(envPath); err != nil {
			log.Printf("Warning: Could not load .env file: %v", err)
		}
	}

	cfg := config.Load()
	pg, err := database.NewPostgres(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer pg.Close()

	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Enter Admin First Name: ")
	firstName, _ := reader.ReadString('\n')
	firstName = strings.TrimSpace(firstName)

	fmt.Print("Enter Admin Last Name: ")
	lastName, _ := reader.ReadString('\n')
	lastName = strings.TrimSpace(lastName)

	fmt.Print("Enter Admin Email: ")
	email, _ := reader.ReadString('\n')
	email = strings.TrimSpace(strings.ToLower(email))

	fmt.Print("Enter Admin Password: ")
	password, _ := reader.ReadString('\n')
	password = strings.TrimSpace(password)

	if email == "" || password == "" {
		log.Fatal("Email and password are required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	adminID := uuid.New()
	permissionsJSON, _ := json.Marshal(map[string]bool{"all": true})

	// Check if admin already exists
	var exists bool
	err = pg.DB.QueryRowContext(context.Background(), "SELECT EXISTS(SELECT 1 FROM admins WHERE email = $1)", email).Scan(&exists)
	if err != nil {
		log.Fatalf("Failed to check if admin exists: %v", err)
	}

	if exists {
		_, err = pg.DB.ExecContext(context.Background(),
			`UPDATE admins SET password_hash = $1, first_name = $2, last_name = $3, updated_at = $4 WHERE email = $5`,
			string(hash), firstName, lastName, time.Now(), email)
		if err != nil {
			log.Fatalf("Failed to update admin: %v", err)
		}
		fmt.Printf("\nAdmin account %s updated successfully.\n", email)
	} else {
		_, err = pg.DB.ExecContext(context.Background(),
			`INSERT INTO admins (id, email, password_hash, first_name, last_name, role, permissions, is_active, created_at, updated_at) 
			 VALUES ($1, $2, $3, $4, $5, 'super_admin', $6, true, $7, $8)`,
			adminID, email, string(hash), firstName, lastName, permissionsJSON, time.Now(), time.Now())
		if err != nil {
			log.Fatalf("Failed to create admin: %v", err)
		}
		fmt.Printf("\nAdmin account %s created successfully.\n", email)
	}

	// Generate the URL using an encrypted secret key
	adminSecret := os.Getenv("ADMIN_LOGIN_SECRET")
	if adminSecret == "" {
		adminSecret = "a8b3c9f2-7d4e-41a5-92b8-f1e0d3c7a9b6"
	}
	
	encryptedToken := encryptSecret(adminSecret)
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "https://tdaskills.co.uk"
	}
	longURL := fmt.Sprintf("%s/admin/login?key=%s", frontendURL, encryptedToken)
	
	// Create TinyURL
	tinyURLReq := fmt.Sprintf("https://tinyurl.com/api-create.php?url=%s", url.QueryEscape(longURL))
	resp, err := http.Get(tinyURLReq)
	if err != nil {
		log.Printf("\nFailed to generate TinyURL: %v. Using long URL instead.", err)
		fmt.Printf("\nSecure Admin Login URL:\n%s\n", longURL)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil || resp.StatusCode != http.StatusOK {
		log.Printf("\nTinyURL API returned error. Using long URL instead.")
		fmt.Printf("\nSecure Admin Login URL:\n%s\n", longURL)
		return
	}

	shortURL := string(bodyBytes)
	
	// Save the generated URLs back to the database for this admin
	_, err = pg.DB.ExecContext(context.Background(),
		`UPDATE admins SET magic_url = $1, tiny_url = $2, updated_at = $3 WHERE email = $4`,
		longURL, shortURL, time.Now(), email)
	if err != nil {
		log.Printf("\nWarning: Failed to save URLs to database: %v", err)
	}

	fmt.Printf("\n=======================================================\n")
	fmt.Printf("Secure Admin Login URL:\n")
	fmt.Printf("%s\n", shortURL)
	fmt.Printf("=======================================================\n\n")
	fmt.Printf("Note: This URL redirects to the hidden login page and validates the secret key.\n")
}
