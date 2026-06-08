-- Migration 007: Create bookings and booking_items tables
-- Up

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN (
            'draft', 'pending', 'pending_payment',
            'confirmed', 'completed', 'cancelled',
            'refunded', 'failed'
        )),
    booking_type VARCHAR(30) NOT NULL CHECK (booking_type IN (
        'course', 'nvq', 'cscs-card', 'citb-test', 'package'
    )),
    personal_details JSONB NOT NULL,
    test_details JSONB,
    card_details JSONB,
    nvq_details JSONB,
    source VARCHAR(50),
    referral_code VARCHAR(50),
    notes TEXT,
    admin_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'GBP',
    created_by UUID REFERENCES admins(id),
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_type ON bookings(booking_type);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    description TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    discount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX idx_booking_items_course ON booking_items(course_id);
