-- Migration 008: Create payments table
-- Up

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
    payment_method VARCHAR(30),
    card_brand VARCHAR(20),
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    receipt_url TEXT,
    receipt_number VARCHAR(50),
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    failure_code VARCHAR(50),
    failure_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at DESC);
