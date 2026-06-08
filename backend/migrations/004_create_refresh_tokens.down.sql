-- Migration 004 Down
DROP INDEX IF EXISTS idx_refresh_expires;
DROP INDEX IF EXISTS idx_refresh_token;
DROP INDEX IF EXISTS idx_refresh_user;
DROP TABLE IF EXISTS refresh_tokens;
