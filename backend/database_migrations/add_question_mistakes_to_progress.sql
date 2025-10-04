-- Add question_mistakes column to Progress table
-- This column will store per-question mistake counts as JSON

ALTER TABLE "Progress" 
ADD COLUMN "question_mistakes" jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN "Progress"."question_mistakes" IS 'JSON object storing mistake count per question ID (e.g., {"1": 2, "3": 1})';
