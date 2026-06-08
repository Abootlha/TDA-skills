ALTER TABLE admin_audit_logs DROP COLUMN IF EXISTS session_id;
DROP TABLE IF EXISTS admin_sessions;
