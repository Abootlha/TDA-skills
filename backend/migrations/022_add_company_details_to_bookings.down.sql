-- Migration 022: Add company_details to bookings
-- Down
ALTER TABLE bookings DROP COLUMN IF EXISTS company_details;
