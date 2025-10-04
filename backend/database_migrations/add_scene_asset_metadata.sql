-- Migration: Add metadata column to scene_asset table
-- This allows scene-specific animation metadata instead of global asset metadata

-- Add metadata column to scene_asset table
ALTER TABLE scene_asset ADD COLUMN metadata JSONB;

-- Migrate existing metadata from asset to scene_asset
-- This copies the metadata from the asset table to the scene_asset table
-- so existing data continues to work
UPDATE scene_asset 
SET metadata = asset.metadata 
FROM asset 
WHERE scene_asset.asset_id = asset.asset_id 
AND asset.metadata IS NOT NULL;

-- Add index for better query performance on metadata
CREATE INDEX idx_scene_asset_metadata ON scene_asset USING GIN (metadata);

-- Optional: Add comment to document the change
COMMENT ON COLUMN scene_asset.metadata IS 'Scene-specific metadata for animations and behaviors (moved from asset.metadata)';
