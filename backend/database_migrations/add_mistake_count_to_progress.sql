-- Migration: Add mistake_count column to Progress table
-- This column stores the total number of wrong answers made by the user

ALTER TABLE "Progress" 
ADD COLUMN IF NOT EXISTS mistake_count INTEGER DEFAULT 0;

-- Add comment to document the column
COMMENT ON COLUMN "Progress".mistake_count IS 'Total number of wrong answers made by the user in the current game session';
