-- Migration 022: Add company_details to bookings
-- Up
ALTER TABLE bookings ADD COLUMN company_details JSONB;
