-- Migration 023: Add paypal columns to payments
-- Up
ALTER TABLE payments ADD COLUMN paypal_order_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN paypal_capture_id VARCHAR(255);
