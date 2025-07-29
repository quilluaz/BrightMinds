import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ProfileHeader from './components/ProfileHeader';
import ProgressStats from './components/ProgressStats';
import AchievementGallery from './components/AchievementGallery';
import RecentActivity from './components/RecentActivity';
import ParentalControls from './components/ParentalControls';
import ProfileSettings from './components/ProfileSettings';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [parentalSettings, setParentalSettings] = useState({
    shareProgress: true,
    allowFriends: false,
    ageAppropriate: true,
    educationalOnly: false,
    enableTimeLimit: true,
    dailyTimeLimit: 60,
    breakReminders: true
  });

  // Mock user data
  const userData = {
    id: 1,
    name: "Emma Johnson",
    title: "Story Explorer",
    level: 7,
    experiencePoints: 2450,
    levelProgress: 65,
    pointsToNextLevel: 550,
    storiesCompleted: 23,
    badgesEarned: 12,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    grade: "grade-3",
    interests: ["animals", "adventure", "fantasy"],
    notifications: {
      dailyReminders: true,
      achievements: true,
      newStories: false
    },
    accessibility: {
      largeText: false,
      highContrast: false,
      reducedMotion: false
    }
  };

  const progressStats = {
    readingLevel: "3.2",
    readingProgress: 85,
    currentStreak: 12,
    longestStreak: 18,
    quizAccuracy: 87,
    totalHours: 45
  };

  const achievements = [
    {
      id: 1,
      title: "First Story",
      description: "Complete your first story",
      category: "reading",
      icon: "BookOpen",
      isUnlocked: true,
      isNew: false,
      earnedDate: "2025-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      category: "quiz",
      icon: "Brain",
      isUnlocked: true,
      isNew: true,
      earnedDate: "2025-01-25T14:20:00Z"
    },
    {
      id: 3,
      title: "Speed Reader",
      description: "Read 3 stories in one day",
      category: "reading",
      icon: "Zap",
      isUnlocked: true,
      isNew: false,
      earnedDate: "2025-01-20T16:45:00Z"
    },
    {
      id: 4,
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      category: "streak",
      icon: "Flame",
      isUnlocked: true,
      isNew: false,
      earnedDate: "2025-01-22T09:15:00Z"
    },
    {
      id: 5,
      title: "Animal Expert",
      description: "Complete 10 animal stories",
      category: "special",
      icon: "PawPrint",
      isUnlocked: false,
      progress: 70,
      requirement: "Complete 3 more animal stories"
    },
    {
      id: 6,
      title: "Perfect Month",
      description: "Complete stories every day for a month",
      category: "streak",
      icon: "Calendar",
      isUnlocked: false,
      progress: 40,
      requirement: "18 more days to go"
    },
    {
      id: 7,
      title: "Adventure Seeker",
      description: "Explore all adventure stories",
      category: "reading",
      icon: "Map",
      isUnlocked: false,
      progress: 25,
      requirement: "Complete 6 more adventure stories"
    },
    {
      id: 8,
      title: "Helping Hand",
      description: "Help 5 friends with stories",
      category: "special",
      icon: "Users",
      isUnlocked: false,
      progress: 0,
      requirement: "Connect with friends first"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "story_completed",
      title: "Completed \'The Magical Forest'",
      description: "Finished reading and answered all questions correctly",
      timestamp: "2025-01-27T02:30:00Z",
      thumbnail: "https://images.pexels.com/photos/1496372/pexels-photo-1496372.jpeg?w=100&h=100&fit=crop",
      details: {
        score: 95,
        points: 150,
        duration: "12 min"
      },
      achievement: "Perfect Score"
    },
    {
      id: 2,
      type: "badge_earned",
      title: "Earned Quiz Master Badge",
      description: "Achieved 100% accuracy on 5 consecutive quizzes",
      timestamp: "2025-01-26T18:45:00Z",
      details: {
        points: 200
      }
    },
    {
      id: 3,
      type: "level_up",
      title: "Reached Level 7",
      description: "Congratulations on your learning progress!",
      timestamp: "2025-01-26T15:20:00Z",
      details: {
        points: 500
      }
    },
    {
      id: 4,
      type: "story_completed",
      title: "Completed \'Ocean Adventures'",
      description: "Explored underwater mysteries and marine life",
      timestamp: "2025-01-25T20:15:00Z",
      thumbnail: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=100&h=100&fit=crop",
      details: {
        score: 88,
        points: 120,
        duration: "15 min"
      }
    },
    {
      id: 5,
      type: "streak_milestone",
      title: "12-Day Learning Streak",
      description: "You\'ve been learning consistently for 12 days!",
      timestamp: "2025-01-25T09:00:00Z",
      details: {
        points: 100
      }
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleProfileUpdate = (updatedProfile) => {
    console.log('Profile updated:', updatedProfile);
    // In a real app, this would update the backend
  };

  const handleParentalSettingsChange = (newSettings) => {
    setParentalSettings(newSettings);
  };

  const handleLogout = () => {
    navigate('/login-screen');
  };

  // Add padding for mobile bottom navigation
  useEffect(() => {
    document.body.style.paddingBottom = '80px';
    return () => {
      document.body.style.paddingBottom = '0';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      {/* Main Content */}
      <main className="pt-16 md:pt-32 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Profile Header - Always Visible */}
          <ProfileHeader user={userData} />

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted rounded-container p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-button font-body font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-background text-primary shadow-warm'
                    : 'text-muted-foreground hover:text-primary hover:bg-background/50'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <ProgressStats stats={progressStats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <AchievementGallery achievements={achievements.slice(0, 4)} />
                  </div>
                  <div>
                    <RecentActivity activities={recentActivities.slice(0, 3)} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'achievements' && (
              <AchievementGallery achievements={achievements} />
            )}

            {activeTab === 'activity' && (
              <RecentActivity activities={recentActivities} />
            )}

            {activeTab === 'settings' && (
              <>
                <ProfileSettings 
                  profile={userData} 
                  onProfileUpdate={handleProfileUpdate} 
                />
                <ParentalControls 
                  settings={parentalSettings}
                  onSettingsChange={handleParentalSettingsChange}
                />
                
                {/* Account Actions */}
                <div className="bg-card rounded-container border border-border shadow-warm-sm p-6">
                  <h2 className="font-display text-xl text-foreground mb-4 flex items-center">
                    <Icon name="LogOut" size={24} className="text-error mr-2" />
                    Account Actions
                  </h2>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      iconName="Home"
                      iconPosition="left"
                      className="w-full sm:w-auto justify-start"
                    >
                      Back to Dashboard
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      className="w-full sm:w-auto justify-start"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions Floating Button - Mobile Only */}
          <div className="fixed bottom-20 right-4 md:hidden z-40">
            <Button
              variant="default"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="w-14 h-14 rounded-full shadow-warm-lg"
            >
              <Icon name="Home" size={24} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;