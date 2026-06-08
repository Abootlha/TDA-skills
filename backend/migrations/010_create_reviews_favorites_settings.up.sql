-- Migration 010: Create course_reviews, user_favorites, admin_settings tables
-- Up

CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    admin_reply TEXT,
    replied_at TIMESTAMP,
    replied_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_reviews_approved ON course_reviews(is_approved, is_published)
    WHERE is_approved = TRUE AND is_published = TRUE;

CREATE TABLE user_favorites (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    source VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_course ON user_favorites(course_id);

CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES admins(id),
    updated_at TIMESTAMP DEFAULT NOW()
);
