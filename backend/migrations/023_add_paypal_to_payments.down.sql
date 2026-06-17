-- Migration 023: Add paypal columns to payments
-- Down
ALTER TABLE payments DROP COLUMN IF EXISTS paypal_order_id;
ALTER TABLE payments DROP COLUMN IF EXISTS paypal_capture_id;
