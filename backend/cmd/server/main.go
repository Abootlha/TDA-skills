package main

import (
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/joho/godotenv"

	"github.com/tdaskills/backend/internal/config"
	"github.com/tdaskills/backend/internal/database"
	"github.com/tdaskills/backend/internal/router"
	ws "github.com/tdaskills/backend/internal/websocket"
	"github.com/tdaskills/backend/seeds"
)

func main() {
	// Parse flags
	migrateFlag := flag.String("migrate", "", "Run migrations: 'up' or 'down'")
	seedFlag := flag.Bool("seed", false, "Seed the database")
	flag.Parse()

	// Load .env file
	envPath := findEnvFile()
	if envPath != "" {
		if err := godotenv.Load(envPath); err != nil {
			log.Printf("Warning: Could not load .env file: %v", err)
		}
	}

	// Load configuration
	cfg := config.Load()

	// Connect to PostgreSQL
	pg, err := database.NewPostgres(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer pg.Close()

	// Handle migrations
	if *migrateFlag != "" {
		runMigrations(pg, *migrateFlag)
		return
	}

	// Handle seeding
	if *seedFlag {
		if err := seeds.Run(pg.DB); err != nil {
			log.Fatalf("Seed failed: %v", err)
		}
		return
	}

	// Connect to Redis
	rdb, err := database.NewRedis(cfg.Redis)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer rdb.Close()

	// Start WebSocket hub
	hub := ws.NewHub()
	go hub.Run()

	// Setup router
	r := router.SetupRouter(cfg, pg, rdb, hub)

	// Start server
	addr := ":" + cfg.Server.Port
	log.Printf("🚀 TDA Skills API starting on %s (env: %s)", addr, cfg.Server.Env)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// runMigrations executes SQL migration files.
func runMigrations(pg *database.PostgresDB, direction string) {
	// Create migrations table if it doesn't exist
	pg.DB.MustExec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT NOW()
		)
	`)

	migrationsDir := findMigrationsDir()
	if migrationsDir == "" {
		log.Fatal("Migrations directory not found")
	}

	suffix := ".up.sql"
	if direction == "down" {
		suffix = ".down.sql"
	}

	// Read migration files
	var files []string
	filepath.WalkDir(migrationsDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(d.Name(), suffix) {
			files = append(files, path)
		}
		return nil
	})

	sort.Strings(files)
	if direction == "down" {
		// Reverse order for down migrations
		for i, j := 0, len(files)-1; i < j; i, j = i+1, j-1 {
			files[i], files[j] = files[j], files[i]
		}
	}

	for _, file := range files {
		name := filepath.Base(file)
		version := strings.Split(name, "_")[0]

		if direction == "up" {
			// Check if already applied
			var count int
			pg.DB.Get(&count, "SELECT COUNT(*) FROM schema_migrations WHERE version = $1", version)
			if count > 0 {
				log.Printf("⏭️  Skipping migration %s (already applied)", name)
				continue
			}
		}

		content, err := os.ReadFile(file)
		if err != nil {
			log.Fatalf("Failed to read migration %s: %v", name, err)
		}

		log.Printf("🔄 Running migration: %s", name)
		if _, err := pg.DB.Exec(string(content)); err != nil {
			log.Fatalf("Migration failed %s: %v", name, err)
		}

		if direction == "up" {
			pg.DB.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", version)
		} else {
			pg.DB.Exec("DELETE FROM schema_migrations WHERE version = $1", version)
		}

		log.Printf("✅ Migration applied: %s", name)
	}

	fmt.Println("All migrations completed!")
}

func findEnvFile() string {
	paths := []string{".env", "../.env", "backend/.env"}
	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}
	return ""
}

func findMigrationsDir() string {
	paths := []string{"migrations", "../migrations", "backend/migrations"}
	for _, p := range paths {
		if info, err := os.Stat(p); err == nil && info.IsDir() {
			return p
		}
	}
	return ""
}
