# BrightMinds

A comprehensive educational application with a modern frontend and robust Spring Boot backend API, featuring interactive games, dual-language support, and advanced security features.

## Project Structure

```
BrightMinds/
├── frontend/          # Frontend application
└── backend/           # Spring Boot REST API
    ├── src/
    │   ├── main/
    │   │   ├── java/JIZAS/BrightMinds/
    │   │   │   ├── entity/           # JPA Entities
    │   │   │   ├── repository/       # Data Access Layer
    │   │   │   ├── service/         # Business Logic Layer
    │   │   │   ├── controller/      # REST Controllers
    │   │   │   ├── dto/            # Data Transfer Objects
    │   │   │   └── BrightMindsApplication.java
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    └── pom.xml
```

## Features

### 🎮 Interactive Game Types
- **Multiple Choice Questions (MCQ)**: Traditional quiz format with immediate feedback
- **Drag and Drop (DnD)**: Interactive drag-and-drop gameplay with visual feedback
- **Sequence Questions (SEQ)**: Order-based questions requiring logical sequencing

### 🌐 Dual-Language Support
- **English and Tagalog**: Full dialogue support in both languages
- **Real-time Language Switching**: Instant text switching during gameplay
- **Language Preferences**: Persistent language settings in user preferences
- **Default Language**: Configurable default language (Tagalog by default)

### 🎵 Advanced Audio System
- **Background Music**: Per-game background music with looping
- **Audio Ducking**: Background music automatically reduces to 50% during dialogue
- **Master Volume Control**: Global volume slider (0-100%) with persistence
- **Mute/Unmute**: Quick audio toggle with visual feedback
- **Volume Persistence**: Audio settings saved across sessions

### 👥 Role-Based Access Control
- **Game Masters**: Full administrative access with demo mode for testing
- **Players**: Standard gameplay access with progress tracking
- **Demo Mode**: Game Masters can play games without affecting scores
- **Secure Routing**: Automatic redirection based on user roles

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Input Validation**: Comprehensive validation on all DTOs
- **Email Validation**: @cit.edu domain requirement for institutional emails
- **XSS Protection**: Protection against malicious user-generated content
- **Password Security**: BCrypt hashing with forced password changes
- **Role-Based Authorization**: Endpoint protection based on user roles

### 📊 Progress Tracking
- **Auto-save**: Automatic progress saving during gameplay
- **Scene Progress**: Per-scene completion tracking
- **Score Analytics**: Comprehensive performance analytics
- **Mistake Tracking**: Detailed error tracking for learning improvement

### 🎨 User Interface
- **Responsive Design**: Adaptive to various screen sizes
- **Folder Tab Controls**: Elegant audio and language controls
- **Visual Feedback**: Screen shake effects and animations
- **Loading States**: Smooth loading indicators throughout the app

## Backend API

The backend is a Spring Boot application that provides a RESTful API for managing educational content including:

- **Questions**: Multiple choice, drag-and-drop, and identification questions
- **Choices**: Answer choices for multiple choice questions
- **Answers**: Text-based answers with optional drag-and-drop positioning
- **Game Attempts**: Track user progress and completion times
- **Progress**: Per-scene progress tracking with auto-save functionality

### Features

- Full CRUD operations for all entities
- RESTful API design with proper HTTP status codes
- JPA/Hibernate for database operations
- MySQL database integration
- Comprehensive error handling
- CORS support for frontend integration
- Game attempt tracking and statistics
- Auto-save progress functionality

### API Endpoints

#### Questions API

- `POST /api/questions` - Create question
- `GET /api/questions` - Get all questions
- `GET /api/questions/{questionId}` - Get question by ID
- `GET /api/questions/{questionId}/full` - Get question with choices and answers
- `GET /api/questions/scene/{sceneId}` - Get questions by scene
- `GET /api/questions/type/{type}` - Get questions by type (MCQ, DragDog, ID)
- `PUT /api/questions/{questionId}` - Update question
- `DELETE /api/questions/{questionId}` - Delete question

#### Choices API

- `POST /api/choices` - Create choice
- `POST /api/choices/question/{questionId}` - Create choice for question
- `GET /api/choices` - Get all choices
- `GET /api/choices/question/{questionId}` - Get choices by question
- `GET /api/choices/question/{questionId}/correct` - Get correct choices
- `PUT /api/choices/{choiceId}` - Update choice
- `DELETE /api/choices/{choiceId}` - Delete choice

#### Answers API

- `POST /api/answers` - Create answer
- `POST /api/answers/question/{questionId}` - Create answer for question
- `GET /api/answers` - Get all answers
- `GET /api/answers/question/{questionId}` - Get answers by question
- `PUT /api/answers/{answerId}` - Update answer
- `DELETE /api/answers/{answerId}` - Delete answer

#### Game Attempts API

- `POST /api/game-attempts` - Save game attempt
- `GET /api/game-attempts/user/{userId}` - Get user's attempts
- `GET /api/game-attempts/user/{userId}/statistics` - Get user statistics

#### Progress API

- `GET /api/progress/user/{userId}/story/{storyId}` - Get user progress
- `POST /api/progress/auto-save` - Auto-save progress
- `PUT /api/progress/{progressId}` - Update progress

## JSON Game Format

The application uses a structured JSON format for game definitions. Here's the complete format specification:

### Game Structure

```json
{
  "title": "Game Title",
  "gameplayType": "MCQ|DnD|SEQ",
  "backgroundMusic": {
    "filePath": "https://example.com/music.mp3",
    "volume": 50
  },
  "scenes": [
    {
      "sceneId": 1,
      "sceneOrder": 1,
      "backgroundImage": "https://example.com/bg.jpg",
      "dialogues": [
        {
          "characterName": "Character Name",
          "lineText": "English dialogue text",
          "lineTextTl": "Tagalog dialogue text",
          "voiceoverUrl": "https://example.com/voice.mp3"
        }
      ],
      "assets": [
        {
          "assetId": 1,
          "name": "Asset Name",
          "type": "image|audio|video",
          "filePath": "https://example.com/asset.jpg",
          "position": { "x": 0, "y": 0 },
          "metadata": {
            "screenShakeOnClick": {
              "duration": 500,
              "intensity": 5
            }
          }
        }
      ],
      "question": {
        "questionId": 1,
        "questionText": "Question text",
        "questionType": "MCQ|DnD|SEQ",
        "choices": [
          {
            "choiceId": 1,
            "choiceText": "Choice text",
            "isCorrect": true,
            "orderIndex": 1
          }
        ],
        "answers": [
          {
            "answerId": 1,
            "answerText": "Answer text",
            "isCorrect": true
          }
        ]
      }
    }
  ]
}
```

### Field Descriptions

#### Game Level
- `title`: Display name of the game
- `gameplayType`: Type of game (MCQ, DnD, or SEQ)
- `backgroundMusic`: Background music configuration
  - `filePath`: URL to the music file
  - `volume`: Volume level (0-100)

#### Scene Level
- `sceneId`: Unique identifier for the scene
- `sceneOrder`: Display order of the scene
- `backgroundImage`: URL to the background image
- `dialogues`: Array of dialogue objects
- `assets`: Array of interactive assets
- `question`: Question object (optional)

#### Dialogue Level
- `characterName`: Name of the speaking character
- `lineText`: English dialogue text
- `lineTextTl`: Tagalog dialogue text (optional)
- `voiceoverUrl`: URL to the voice audio file (optional)

#### Asset Level
- `assetId`: Unique identifier for the asset
- `name`: Display name of the asset
- `type`: Type of asset (image, audio, video)
- `filePath`: URL to the asset file
- `position`: Position coordinates (x, y)
- `metadata`: Additional configuration object
  - `screenShakeOnClick`: Screen shake effect configuration
    - `duration`: Duration in milliseconds
    - `intensity`: Shake intensity

#### Question Level
- `questionId`: Unique identifier for the question
- `questionText`: The question text
- `questionType`: Type of question (MCQ, DnD, SEQ)
- `choices`: Array of answer choices
- `answers`: Array of correct answers

#### Choice Level
- `choiceId`: Unique identifier for the choice
- `choiceText`: The choice text
- `isCorrect`: Whether this choice is correct
- `orderIndex`: Display order for sequence questions

#### Answer Level
- `answerId`: Unique identifier for the answer
- `answerText`: The answer text
- `isCorrect`: Whether this answer is correct

## Frontend

The frontend is a React-based single-page application built with modern web technologies:

### Technology Stack
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **Howler.js**: Audio library for game sounds and background music
- **Axios**: HTTP client for API communication

### Key Components
- **GamePageMCQ**: Multiple choice question gameplay
- **GamePageDnD**: Drag-and-drop gameplay
- **GamePageSEQ**: Sequence question gameplay
- **AudioLanguageControls**: Audio and language control panel
- **BubbleMenu**: Navigation menu with role-based items
- **PlayerDashboard**: Student progress and analytics dashboard
- **GameMasterDashboard**: Administrative dashboard for game masters

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live progress tracking and score updates
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized asset loading and caching
- **Error Handling**: Comprehensive error boundaries and user feedback

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with expiration
- **Role-Based Access**: Different access levels for Game Masters and Players
- **Protected Routes**: Frontend route protection based on user roles
- **Session Management**: Secure session handling with automatic logout

### Data Protection
- **Input Validation**: Server-side validation on all DTOs and entities
- **Email Validation**: @cit.edu domain requirement for institutional emails
- **XSS Protection**: Sanitization of user-generated content
- **CSRF Protection**: Cross-Site Request Forgery protection with token validation
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries

### Security Headers
- **CORS Configuration**: Properly configured Cross-Origin Resource Sharing
- **Content Security Policy**: Protection against code injection attacks
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Password Security**: BCrypt hashing with salt rounds

### User Management
- **Password Reset**: Secure password reset functionality for Game Masters
- **Forced Password Change**: New users must change password on first login
- **Account Lockout**: Protection against brute force attacks
- **Audit Logging**: Comprehensive logging of security events

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- Node.js (for frontend)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Configure your database in `src/main/resources/application.properties`

3. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

4. The API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (if needed):

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The application will be available at `http://localhost:5173`

### Game Seeding

To seed game data into the backend:

1. Ensure your backend is running
2. Navigate to the frontend directory
3. Run the seeder script:

   ```bash
   node seed-game1.js [BACKEND_URL]
   ```

   Example:
   ```bash
   node seed-game1.js http://localhost:8080
   ```

## Usage

### For Students (Players)
1. **Sign Up**: Create an account with your @cit.edu email
2. **Login**: Access your personalized dashboard
3. **Play Games**: Select and play educational games
4. **Track Progress**: Monitor your performance and improvement
5. **Language Settings**: Switch between English and Tagalog

### For Teachers (Game Masters)
1. **Admin Access**: Full administrative dashboard
2. **Student Management**: Create and manage student accounts
3. **Password Reset**: Reset student passwords when needed
4. **Demo Mode**: Test games without affecting scores
5. **Analytics**: View comprehensive student performance data

## Development

### Backend Development
- **API Documentation**: Available at `/swagger-ui.html` when running
- **Database**: MySQL with JPA/Hibernate ORM
- **Testing**: JUnit tests for all service layers
- **Logging**: Comprehensive logging with SLF4J

### Frontend Development
- **Hot Reload**: Vite provides instant hot module replacement
- **TypeScript**: Optional TypeScript support available
- **Linting**: ESLint configuration for code quality
- **Testing**: Jest and React Testing Library setup

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
