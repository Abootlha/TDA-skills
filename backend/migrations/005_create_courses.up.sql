-- Migration 005: Create courses table
-- Up

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'smsts', 'sssts', 'nvq', 'health-safety', 'card', 'citb'
    )),
    sub_category VARCHAR(100),
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'course', 'nvq', 'cscs-card', 'citb-test'
    )),
    short_description TEXT,
    description TEXT,
    who_should_attend TEXT[],
    learning_outcomes JSONB,
    duration VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    price_display VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'GBP',
    images JSONB,
    documents JSONB,
    prerequisites TEXT[],
    eligibility TEXT[],
    certification TEXT[],
    renewal_info TEXT[],
    prerequisites_years_experience INTEGER,
    prerequisites_min_age INTEGER,
    accreditation_body VARCHAR(100),
    accreditation_code VARCHAR(50),
    faq JSONB,
    available_dates JSONB,
    locations JSONB,
    max_students INTEGER DEFAULT 20,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    view_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_sub_category ON courses(sub_category);
CREATE INDEX idx_courses_type ON courses(type);
CREATE INDEX idx_courses_active ON courses(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_courses_created ON courses(created_at DESC);
