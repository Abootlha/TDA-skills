CREATE TABLE login_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL
        CHECK (event_type IN (
            'login_success', 'login_failed', 'logout', 'password_changed',
            'email_verified', '2fa_enabled', '2fa_disabled', '2fa_failed',
            'session_expired', 'account_locked', 'account_unlocked')),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_login_activity_user ON login_activity(user_id);
CREATE INDEX idx_login_activity_admin ON login_activity(admin_id);
CREATE INDEX idx_login_activity_created ON login_activity(created_at DESC);

-- Add ip_address to refresh_tokens if missing
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS ip_address INET;

-- Add created_at DESC index on users if missing
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);
