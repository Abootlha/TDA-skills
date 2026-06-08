CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at) WHERE revoked_at IS NULL;

-- Update admin_audit_logs to reference admin_sessions
ALTER TABLE admin_audit_logs ADD COLUMN session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL;
