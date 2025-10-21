#!/bin/bash

# Script to reseed Story 2 with updated game2.json
# Usage: ./reseed-story2.sh

echo "Reseeding Story 2..."

# Step 1: Delete Story 2 (adjust the API endpoint and credentials as needed)
echo "Step 1: Deleting existing Story 2..."
curl -X DELETE http://localhost:8080/api/stories/2 \
  -H "Content-Type: application/json"

echo ""
echo "Step 2: Seeding new Story 2 data..."

# Step 2: Seed new Story 2 data
curl -X POST http://localhost:8080/api/seeder/story \
  -H "Content-Type: application/json" \
  -d @frontend/game2.json

echo ""
echo "Done! Story 2 has been reseeded."

