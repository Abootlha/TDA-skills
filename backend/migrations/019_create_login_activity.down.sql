DROP TABLE IF EXISTS login_activity;
ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS ip_address;
DROP INDEX IF EXISTS idx_users_created;
