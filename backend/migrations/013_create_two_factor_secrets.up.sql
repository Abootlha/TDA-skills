CREATE TABLE two_factor_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    secret VARCHAR(255) NOT NULL,
    method VARCHAR(20) DEFAULT 'totp'
        CHECK (method IN ('totp', 'email_code')),
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes JSONB,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_2fa_user ON two_factor_secrets(user_id) WHERE is_enabled = TRUE;
