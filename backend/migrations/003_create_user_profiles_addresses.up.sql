-- Migration 003: Create user profiles and addresses
-- Up

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    employer VARCHAR(255),
    years_experience INTEGER,
    nin_number VARCHAR(20),
    cscs_card_number VARCHAR(50),
    citb_number VARCHAR(50),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    marketing_consent BOOLEAN DEFAULT FALSE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    postcode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'United Kingdom',
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
