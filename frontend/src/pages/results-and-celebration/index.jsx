import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ResultsHeader from './components/ResultsHeader';
import ScoreDisplay from './components/ScoreDisplay';
import AnswerReview from './components/AnswerReview';
import AchievementBadges from './components/AchievementBadges';
import ProgressStats from './components/ProgressStats';
import CelebrationAnimation from './components/CelebrationAnimation';
import ActionButtons from './components/ActionButtons';
import LearningHighlights from './components/LearningHighlights';

const ResultsAndCelebration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCelebration, setShowCelebration] = useState(true);

  // Mock story results data
  const storyResults = {
    storyTitle: "The Magical Forest Adventure",
    completionTime: "8 minutes",
    totalQuestions: 8,
    correctAnswers: 6,
    percentage: 75,
    questions: [
      {
        question: "What did Emma find in the magical forest?",
        options: ["A talking rabbit", "A golden key", "A magic wand", "A treasure chest"],
        correctAnswer: 1
      },
      {
        question: "Who helped Emma on her journey?",
        options: ["A wise owl", "A friendly dragon", "A magic fairy", "A talking tree"],
        correctAnswer: 0
      },
      {
        question: "What was the main lesson of the story?",
        options: ["Always be brave", "Help others in need", "Never give up", "Believe in yourself"],
        correctAnswer: 3
      },
      {
        question: "Where did Emma\'s adventure begin?",
        options: ["In her backyard", "At school", "In the park", "At the library"],
        correctAnswer: 0
      },
      {
        question: "What color was the magical door?",
        options: ["Blue", "Red", "Golden", "Silver"],
        correctAnswer: 2
      },
      {
        question: "How did Emma feel at the end?",
        options: ["Scared", "Confused", "Proud and happy", "Tired"],
        correctAnswer: 2
      },
      {
        question: "What did the wise owl teach Emma?",
        options: ["How to fly", "To trust herself", "Magic spells", "Forest secrets"],
        correctAnswer: 1
      },
      {
        question: "What happened to the golden key?",
        options: ["It disappeared", "Emma kept it", "It turned into a butterfly", "The owl took it"],
        correctAnswer: 2
      }
    ],
    userAnswers: [1, 0, 3, 0, 1, 2, 1, 2] // User's selected answers
  };

  // Mock achievements data
  const achievements = [
    { name: 'First Story', earned: true },
    { name: 'Perfect Score', earned: false },
    { name: 'Speed Reader', earned: true },
    { name: 'Persistent Learner', earned: true },
    { name: 'Story Explorer', earned: false },
    { name: 'Reading Champion', earned: false }
  ];

  const newBadges = ['Persistent Learner'];

  // Mock progress stats
  const progressStats = {
    storiesCompleted: 12,
    totalPoints: 2450,
    readingStreak: 7,
    averageScore: 78
  };

  // Mock learning highlights
  const learningHighlights = [
    {
      type: 'vocabulary',
      title: 'New Words Learned',
      description: 'You discovered 5 new vocabulary words in this story!',
      examples: ['magical', 'adventure', 'courage', 'wisdom', 'journey']
    },
    {
      type: 'comprehension',
      title: 'Reading Comprehension',
      description: 'You showed great understanding of the story\'s main message.',
      examples: []
    },
    {
      type: 'critical-thinking',
      title: 'Problem Solving',
      description: 'You used critical thinking to answer challenging questions.',
      examples: []
    }
  ];

  useEffect(() => {
    // Auto-hide celebration animation after 5 seconds
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleTryAgain = () => {
    // Navigate back to story gameplay
    navigate('/story-library');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      <Header />
      <TabNavigation />
      
      {/* Celebration Animation Overlay */}
      <CelebrationAnimation isVisible={showCelebration} />
      
      {/* Main Content */}
      <main className="pt-32 md:pt-40 pb-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <ResultsHeader 
            storyTitle={storyResults.storyTitle}
            completionTime={storyResults.completionTime}
            totalQuestions={storyResults.totalQuestions}
          />

          {/* Score Display */}
          <ScoreDisplay 
            correctAnswers={storyResults.correctAnswers}
            totalQuestions={storyResults.totalQuestions}
            percentage={storyResults.percentage}
          />

          {/* Achievement Badges */}
          <AchievementBadges 
            achievements={achievements}
            newBadges={newBadges}
          />

          {/* Progress Stats */}
          <ProgressStats stats={progressStats} />

          {/* Learning Highlights */}
          <LearningHighlights highlights={learningHighlights} />

          {/* Answer Review */}
          <AnswerReview 
            questions={storyResults.questions}
            userAnswers={storyResults.userAnswers}
          />

          {/* Action Buttons */}
          <ActionButtons 
            onTryAgain={handleTryAgain}
            nextStoryAvailable={true}
          />
        </div>
      </main>
    </div>
  );
};

export default ResultsAndCelebration;