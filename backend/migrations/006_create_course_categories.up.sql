-- Migration 006: Create course_categories and xref tables
-- Up

CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE course_category_xref (
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES course_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, category_id)
);
