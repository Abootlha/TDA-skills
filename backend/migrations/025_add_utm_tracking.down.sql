-- Remove UTM tracking columns from bookings table
ALTER TABLE bookings
DROP COLUMN IF EXISTS utm_source,
DROP COLUMN IF EXISTS utm_medium,
DROP COLUMN IF EXISTS utm_campaign,
DROP COLUMN IF EXISTS utm_term,
DROP COLUMN IF EXISTS utm_content;

-- Remove UTM tracking columns from enquiries table
ALTER TABLE enquiries
DROP COLUMN IF EXISTS utm_source,
DROP COLUMN IF EXISTS utm_medium,
DROP COLUMN IF EXISTS utm_campaign,
DROP COLUMN IF EXISTS utm_term,
DROP COLUMN IF EXISTS utm_content;
