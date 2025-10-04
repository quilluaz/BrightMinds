-- Migration: Add answer_states column to Progress table
-- This column stores the visual states of answer buttons (correct/incorrect) for persistence

ALTER TABLE "Progress" 
ADD COLUMN IF NOT EXISTS answer_states JSONB;

-- Add comment to document the column
COMMENT ON COLUMN "Progress".answer_states IS 'JSON object storing the visual states of answer buttons (correct/incorrect) for persistence across refreshes';
