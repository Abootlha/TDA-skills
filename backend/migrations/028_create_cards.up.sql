-- Migration 028: Create cards table
-- Up

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    badge VARCHAR(100),
    badge_class VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cscs', 'cpcs')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cards_slug ON cards(slug);
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_active ON cards(is_active) WHERE is_active = TRUE;
