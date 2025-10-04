# Game Attempts Testing Guide

## Overview

The Game Attempts system has been successfully integrated into the frontend GamePage. Now when users complete a story, their attempt will be automatically recorded with score, date, and completion time.

## What Was Added

### Frontend Changes (GamePage.jsx)

1. **Start Time Tracking**: Records when the game actually starts (when user clicks "Press to Start")
2. **Game Attempt Recording**: Automatically saves attempt data when story is completed
3. **Match History Display**: Added a "View Match History" button in the score screen
4. **Match History Modal**: Shows all previous attempts with detailed information

### Backend Changes

1. **Test Endpoint**: Added `/api/game-attempts/test/user/{userId}` for easy testing
2. **All existing Game Attempt functionality** (already implemented)

## How to Test

### Step 1: Run the Database Migration

First, make sure the database table exists:

```sql
-- Execute the contents of backend/database_migrations/add_game_attempts_table.sql
```

### Step 2: Complete a Story

1. Start the application (both frontend and backend)
2. Log in as a user
3. Navigate to a story and complete it
4. When the story finishes, you should see the score screen
5. Click "View Match History" to see if the attempt was recorded

### Step 3: Verify in Backend

You can also test the backend directly:

```bash
# Get all attempts for a user (replace 1 with actual user ID)
GET http://localhost:8080/api/game-attempts/test/user/1

# Or get the full match history
GET http://localhost:8080/api/game-attempts/user/1
```

### Step 4: Check Console Logs

The frontend will log detailed information:

- "Saving game attempt:" - Shows the data being sent
- "Game attempt saved successfully:" - Confirms successful save
- "Match history fetched:" - Shows retrieved attempts

## Expected Behavior

### When Story Completes:

1. Score is calculated (same as before)
2. Game attempt is automatically saved to backend
3. Score screen shows with "View Match History" button
4. Console shows success/error messages

### Match History Modal Shows:

- Story title
- Date and time of attempt
- Percentage score
- Points earned vs total possible
- Questions correct vs total answered
- Completion time (if available)

## Troubleshooting

### If Attempts Aren't Being Saved:

1. Check browser console for error messages
2. Verify user is logged in (check localStorage for "bm_user")
3. Check backend logs for any errors
4. Ensure database migration was run

### If Match History is Empty:

1. Complete at least one story first
2. Check the test endpoint directly: `/api/game-attempts/test/user/{userId}`
3. Verify the user ID is correct

### Common Issues:

- **User not logged in**: The system requires a valid user in localStorage
- **Database not migrated**: Run the SQL migration script
- **Backend not running**: Ensure the Spring Boot application is running
- **CORS issues**: The backend has CORS enabled for all origins

## API Endpoints Available

- `POST /api/game-attempts` - Save new attempt (used by frontend)
- `GET /api/game-attempts/user/{userId}` - Get all attempts for user
- `GET /api/game-attempts/test/user/{userId}` - Test endpoint for verification
- `GET /api/game-attempts/user/{userId}/paginated` - Paginated attempts
- `GET /api/game-attempts/user/{userId}/story/{storyId}` - Attempts for specific story
- `GET /api/game-attempts/user/{userId}/statistics` - User statistics

## Next Steps

Once testing is complete, you can:

1. Build a dedicated Match History page
2. Add filtering and sorting options
3. Implement leaderboards
4. Add achievement systems based on attempt milestones
5. Create analytics dashboards for administrators

The foundation is now in place for a comprehensive match history system!
