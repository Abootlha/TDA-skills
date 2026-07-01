package seeds

import (
	"context"
	"encoding/json"
	"log"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

// Run seeds the database with initial data.
func Run(db *sqlx.DB) error {
	ctx := context.Background()

	// Seed super admin
	if err := seedAdmin(ctx, db); err != nil {
		log.Printf("Warning: admin seed failed: %v", err)
	}

	// Seed course categories
	if err := seedCategories(ctx, db); err != nil {
		log.Printf("Warning: categories seed failed: %v", err)
	}

	// Seed default settings
	if err := seedSettings(ctx, db); err != nil {
		log.Printf("Warning: settings seed failed: %v", err)
	}

	// Seed default cards
	if err := seedCards(ctx, db); err != nil {
		log.Printf("Warning: cards seed failed: %v", err)
	}

	log.Println("✅ Database seeded successfully")
	return nil
}

func seedAdmin(ctx context.Context, db *sqlx.DB) error {
	var count int
	db.GetContext(ctx, &count, "SELECT COUNT(*) FROM admins")
	if count > 0 {
		log.Println("Admins already seeded, skipping...")
		return nil
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 12)
	permissions, _ := json.Marshal(map[string][]string{
		"courses":  {"read", "write", "delete"},
		"users":    {"read", "write"},
		"bookings": {"read", "write"},
		"payments": {"read", "write"},
		"settings": {"read", "write"},
	})

	_, err := db.ExecContext(ctx, `
		INSERT INTO admins (email, password_hash, first_name, last_name, role, permissions)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, "admin@tdaskills.co.uk", string(hash), "Super", "Admin", "super_admin", permissions)

	if err != nil {
		return err
	}

	log.Println("  → Created super admin: admin@tdaskills.co.uk / admin123")
	return nil
}

func seedCategories(ctx context.Context, db *sqlx.DB) error {
	var count int
	db.GetContext(ctx, &count, "SELECT COUNT(*) FROM course_categories")
	if count > 0 {
		log.Println("Categories already seeded, skipping...")
		return nil
	}

	categories := []struct {
		Name  string
		Slug  string
		Icon  string
		Order int
	}{
		{"SMSTS", "smsts", "shield", 1},
		{"SSSTS", "sssts", "shield-check", 2},
		{"NVQ Level 2", "nvq-level-2", "award", 3},
		{"NVQ Level 3", "nvq-level-3", "award", 4},
		{"NVQ Level 4", "nvq-level-4", "award", 5},
		{"NVQ Level 6", "nvq-level-6", "award", 6},
		{"NVQ Level 7", "nvq-level-7", "award", 7},
		{"CSCS Cards", "cscs-cards", "credit-card", 8},
		{"CITB Tests", "citb-tests", "clipboard-check", 9},
		{"Health & Safety", "health-safety", "heart-pulse", 10},
		{"Plant & Machinery", "plant-machinery", "truck", 11},
		{"Crane Operations", "crane", "construction", 12},
	}

	for _, cat := range categories {
		_, err := db.ExecContext(ctx,
			`INSERT INTO course_categories (name, slug, icon, display_order) VALUES ($1, $2, $3, $4)`,
			cat.Name, cat.Slug, cat.Icon, cat.Order)
		if err != nil {
			return err
		}
	}

	log.Printf("  → Created %d course categories", len(categories))
	return nil
}

func seedSettings(ctx context.Context, db *sqlx.DB) error {
	var count int
	db.GetContext(ctx, &count, "SELECT COUNT(*) FROM admin_settings")
	if count > 0 {
		log.Println("Settings already seeded, skipping...")
		return nil
	}

	settings := []struct {
		Key         string
		Value       interface{}
		Description string
		IsPublic    bool
	}{
		{"site_name", "TDA Skills", "Website name", true},
		{"site_tagline", "Get Qualified. Get Certified. Get On Site.", "Website tagline", true},
		{"contact_email", "info@tdaskills.co.uk", "Contact email address", true},
		{"contact_phone", "+44 123 456 7890", "Contact phone number", true},
		{"maintenance_mode", false, "Enable maintenance mode", false},
	}

	for _, s := range settings {
		val, _ := json.Marshal(s.Value)
		_, err := db.ExecContext(ctx,
			`INSERT INTO admin_settings (key, value, description, is_public) VALUES ($1, $2, $3, $4)`,
			s.Key, val, s.Description, s.IsPublic)
		if err != nil {
			return err
		}
	}

	log.Printf("  → Created %d default settings", len(settings))
	return nil
}

func seedCards(ctx context.Context, db *sqlx.DB) error {
	var count int
	db.GetContext(ctx, &count, "SELECT COUNT(*) FROM cards")
	if count > 0 {
		log.Println("Cards already seeded, skipping...")
		return nil
	}

	cards := []struct {
		Title       string
		Badge       string
		BadgeClass  string
		Description string
		Image       string
		Price       float64
		Slug        string
		Type        string
	}{
		// CSCS Cards
		{"CSCS Green Card", "LABOURER", "bg-[#E1F7EA] text-[#16A34A]", "For entry-level workers on construction sites. Requires Level 1 Health & Safety and CITB Test.", "/cscs-green-card.png", 199.00, "green", "cscs"},
		{"CSCS Blue Card", "SKILLED WORKER", "bg-[#E5F0FF] text-[#2563EB]", "For those who have completed a relevant NVQ Level 2 or apprenticeship.", "/cscs-blue-card.png", 249.00, "blue", "cscs"},
		{"CSCS Gold Card", "SUPERVISOR", "bg-[#FFF5DC] text-[#D97706]", "Advanced card for site supervisors. Requires NVQ Level 3 or Level 4.", "/cscs-golden-card.png", 299.00, "gold", "cscs"},
		{"CSCS Black Card", "MANAGER", "bg-[#F3F4F6] text-[#374151]", "For senior managers and highly qualified technical staff. Requires Level 5-7 NVQ.", "/black-cscs-card.png", 399.00, "black", "cscs"},
		{"CSCS Red Card", "PROVISIONAL", "bg-[#FEE2E2] text-[#DC2626]", "Temporary card for workers gaining on-the-job experience. Valid for 6 months.", "/cscs-red-card.png", 149.00, "red", "cscs"},
		{"CSCS Trainee Card", "TRAINEE", "bg-[#FEE2E2] text-[#DC2626]", "For technical, professional, or managerial trainees enrolled on degree or HND courses.", "/cscs-trainee-card.png", 149.00, "red-tsm", "cscs"},
		// CPCS Cards
		{"CPCS Card Application", "CARD APPLICATION", "bg-[#E5F0FF] text-[#2563EB]", "Fast track your CPCS card application with our dedicated support team.", "/cscs-blue-card.png", 249.00, "cpcs-card", "cpcs"},
		{"Tutor-Led CPCS Course", "TUTOR-LED TRAINING", "bg-[#FFF5DC] text-[#D97706]", "Live interactive classroom training with experienced plant operators.", "/cscs-red-card.png", 499.00, "cpcs-training", "cpcs"},
		{"NVQ L2 Plant Operator", "NVQ LEVEL 2", "bg-[#E1F7EA] text-[#16A34A]", "Achieve your Blue CPCS competent operator card through onsite assessment.", "/cscs-golden-card.png", 799.00, "plant-operator", "cpcs"},
	}

	for _, card := range cards {
		_, err := db.ExecContext(ctx, `
			INSERT INTO cards (title, badge, badge_class, description, image, price, slug, type)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, card.Title, card.Badge, card.BadgeClass, card.Description, card.Image, card.Price, card.Slug, card.Type)
		if err != nil {
			return err
		}
	}

	log.Printf("  → Created %d dynamic cards", len(cards))
	return nil
}
