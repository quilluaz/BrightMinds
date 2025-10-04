-- Migration: Add game_start_time column to Progress table
-- This column stores when the user started the current game session

ALTER TABLE "Progress" 
ADD COLUMN IF NOT EXISTS game_start_time TIMESTAMP;

-- Add comment to document the column
COMMENT ON COLUMN "Progress".game_start_time IS 'Timestamp when the user started the current game session';
