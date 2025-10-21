# Player Dashboard

## Overview
The Player Dashboard is a comprehensive interface that allows players to view their game performance, match history, and earned badges. It provides a gamified experience with progress tracking and achievement visualization.

## Features

### 1. Overview Tab
- **Statistics Cards**: Display total games played, badges earned, average score, and best score
- **Recent Games**: Shows the 5 most recent game attempts with scores and completion times
- **Recent Badges**: Displays the 6 most recently earned badges

### 2. Match History Tab
- **Complete History**: Shows all game attempts with detailed information
- **Score Visualization**: Color-coded scores (green for excellent, yellow for good, orange for passing, red for needs improvement)
- **Performance Metrics**: Includes completion time, score percentage, and performance badges

### 3. Badges Tab
- **Progress Summary**: Shows overall badge completion progress
- **All Badges Grid**: Displays all available badges with earned/locked status
- **Badge Details**: Shows badge descriptions and earning dates

## API Endpoints Used

### Game Attempts
- `GET /api/game-attempts/user/{userId}` - Fetch user's game attempts
- `GET /api/game-attempts/user/{userId}/paginated` - Paginated game attempts
- `GET /api/game-attempts/user/{userId}/story/{storyId}` - Attempts for specific story

### Badges
- `GET /api/badges` - Fetch all available badges
- `GET /api/user-badges/user/{userId}/with-badge` - Fetch user's earned badges with badge details
- `GET /api/user-badges/user/{userId}/has/{badgeId}` - Check if user has specific badge

## Styling
The dashboard follows the BrightMinds design system:
- **Colors**: Uses the BrightMinds color palette (bmGreen, bmYellow, bmLightYellow, etc.)
- **Typography**: League Spartan for headings, Lexend Deca for body text
- **Components**: Consistent card-based layout with shadow effects
- **Responsive**: Mobile-friendly design with responsive grid layouts

## Navigation
- Accessible via the bubble menu for players (role: "PLAYER")
- Route: `/dashboard`
- Protected route that requires authentication and player role

## Badge System Integration
The dashboard integrates with the backend badge system:
- Automatic badge awarding when games are completed
- Real-time badge status updates
- Progress tracking for unearned badges
- Visual indicators for earned vs. locked badges

## Future Enhancements
- Badge progress calculations based on specific conditions
- Achievement notifications
- Social features (leaderboards, friend comparisons)
- Detailed analytics and insights
- Export functionality for progress reports
