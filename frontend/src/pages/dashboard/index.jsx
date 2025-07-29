import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import WelcomeCard from './components/WelcomeCard';
import ProgressSection from './components/ProgressSection';
import ContinueStoryCard from './components/ContinueStoryCard';
import RecentAchievements from './components/RecentAchievements';
import QuickAccessCards from './components/QuickAccessCards';
import DailyGoals from './components/DailyGoals';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const userData = {
    id: 1,
    name: "Emma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    level: 5,
    streak: 7,
    totalPoints: 1250
  };

  // Mock progress data
  const progressData = {
    storiesCompleted: 12,
    totalStories: 20,
    achievements: 8,
    totalAchievements: 15,
    streak: 7
  };

  // Mock current story data
  const currentStoryData = {
    id: 1,
    title: "The Magical Forest Adventure",
    description: "Join Luna the fairy as she discovers the secrets hidden deep within the enchanted forest. A tale of friendship, courage, and magical discoveries awaits!",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    progress: 65,
    readingTime: 8,
    chapter: 3,
    totalChapters: 5
  };

  // Mock achievements data
  const achievementsData = [
    {
      id: 1,
      title: "Story Master",
      description: "Completed 10 stories",
      icon: "BookOpen",
      color: "primary",
      isNew: true,
      earnedDate: "2025-01-25"
    },
    {
      id: 2,
      title: "Quick Reader",
      description: "Read for 7 days straight",
      icon: "Zap",
      color: "accent",
      isNew: false,
      earnedDate: "2025-01-24"
    },
    {
      id: 3,
      title: "Question Champion",
      description: "Answered 50 questions correctly",
      icon: "Trophy",
      color: "success",
      isNew: true,
      earnedDate: "2025-01-26"
    },
    {
      id: 4,
      title: "Explorer",
      description: "Discovered 5 new story worlds",
      icon: "Compass",
      color: "secondary",
      isNew: false,
      earnedDate: "2025-01-23"
    }
  ];

  // Mock daily goals data
  const dailyGoalsData = {
    completed: 2,
    total: 4,
    items: [
      {
        id: 1,
        title: "Read for 15 minutes",
        description: "Complete daily reading goal",
        icon: "Clock",
        current: 15,
        target: 15,
        points: 50
      },
      {
        id: 2,
        title: "Answer 5 questions",
        description: "Test your comprehension",
        icon: "HelpCircle",
        current: 5,
        target: 5,
        points: 30
      },
      {
        id: 3,
        title: "Complete 1 story",
        description: "Finish an adventure",
        icon: "BookOpen",
        current: 0,
        target: 1,
        points: 100
      },
      {
        id: 4,
        title: "Earn 100 points",
        description: "Collect learning points",
        icon: "Star",
        current: 80,
        target: 100,
        points: 25
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 md:pt-32 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="font-display text-xl text-foreground mb-2">
                  Loading your adventure...
                </h2>
                <p className="font-body text-muted-foreground">
                  Getting everything ready for you!
                </p>
              </div>
            </div>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 md:pt-32 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome Section */}
          <WelcomeCard user={userData} />
          
          {/* Progress Section */}
          <ProgressSection progress={progressData} />
          
          {/* Continue Story Section */}
          <ContinueStoryCard currentStory={currentStoryData} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recent Achievements & Quick Access */}
            <div className="lg:col-span-2 space-y-6">
              <RecentAchievements achievements={achievementsData} />
              <QuickAccessCards />
            </div>
            
            {/* Right Column - Daily Goals */}
            <div className="lg:col-span-1">
              <DailyGoals goals={dailyGoalsData} />
            </div>
          </div>
          
          {/* Motivational Footer */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-container p-6">
              <h3 className="font-display text-lg text-foreground mb-2">
                Keep up the amazing work, {userData.name}! 🌟
              </h3>
              <p className="font-body text-muted-foreground">
                You're doing great! Every story you read makes you smarter and more creative.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <TabNavigation />
    </div>
  );
};

export default Dashboard;