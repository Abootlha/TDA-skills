-- Migration 008 Down
DROP INDEX IF EXISTS idx_payments_created;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_payments_intent;
DROP INDEX IF EXISTS idx_payments_user;
DROP INDEX IF EXISTS idx_payments_booking;
DROP TABLE IF EXISTS payments;
