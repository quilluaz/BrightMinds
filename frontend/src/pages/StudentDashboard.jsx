"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedCard from "../components/AnimatedCard";
import Badge from "../components/Badge";
import ConfettiEffect from "../components/ConfettiEffect";
import ClassroomCard from "../components/ClassroomCard";
import ClassroomView from "../components/ClassroomView";
import UserSettings from "../components/UserSettings";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [totalGems, setTotalGems] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("👨‍🎓");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classrooms, setClassrooms] = useState([]);

  const avatarOptions = [
    "👨‍🎓",
    "👩‍🎓",
    "🧑‍🎓",
    "🦊",
    "🐱",
    "🐶",
    "🐼",
    "🐯",
    "🦁",
    "🐸",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Simulate API calls with mock data for now
          setTimeout(() => {
            setRewards([
              {
                id: 1,
                type: "BADGE",
                badgeName: "Perfect Score Master",
                earnedAt: "2023-05-15",
              },
              {
                id: 2,
                type: "BADGE",
                badgeName: "Quick Learner",
                earnedAt: "2023-05-10",
              },
              {
                id: 3,
                type: "BADGE",
                badgeName: "Streak Champion",
                earnedAt: "2023-05-05",
              },
              { id: 4, type: "GEMS", gems: 50, earnedAt: "2023-05-01" },
            ]);
            setTotalGems(350);
            setProgress([
              { id: 1, quizId: 1, score: 95, completedAt: "2023-05-15" },
              { id: 2, quizId: 2, score: 85, completedAt: "2023-05-10" },
              { id: 3, quizId: 3, score: 90, completedAt: "2023-05-05" },
            ]);
            setClassrooms([
              {
                id: 1,
                name: "Grade 3 - Love",
                description: "Ms. Santos' Class",
                color: "primary",
                icon: "📚",
                activities: [
                  {
                    id: 1,
                    title: "Mga Bayani ng Pilipinas",
                    description: "Learn about Filipino heroes",
                    type: "quiz",
                    status: "completed",
                  },
                  {
                    id: 2,
                    title: "Mga Lalawigan ng Pilipinas",
                    description: "Explore Philippine provinces",
                    type: "game",
                    status: "in-progress",
                  },
                  {
                    id: 3,
                    title: "Mga Tradisyon ng Pilipinas",
                    description: "Discover Filipino traditions",
                    type: "quiz",
                    status: "new",
                  },
                ],
                students: [
                  {
                    id: 1,
                    name: "Maria Garcia",
                    email: "maria@example.com",
                    score: 95,
                    progress: 80,
                    avatar: "👩‍🎓",
                  },
                  {
                    id: 2,
                    name: "Juan Santos",
                    email: "juan@example.com",
                    score: 88,
                    progress: 65,
                    avatar: "👨‍🎓",
                  },
                  {
                    id: 3,
                    name: "Sofia Cruz",
                    email: "sofia@example.com",
                    score: 92,
                    progress: 75,
                    avatar: "👩‍🎓",
                  },
                  {
                    id: 4,
                    name: "Miguel Lopez",
                    email: "miguel@example.com",
                    score: 78,
                    progress: 50,
                    avatar: "👨‍🎓",
                  },
                  {
                    id: 5,
                    name: "Isabella Reyes",
                    email: "isabella@example.com",
                    score: 85,
                    progress: 60,
                    avatar: "👩‍🎓",
                  },
                ],
              },
              {
                id: 2,
                name: "Grade 3 - Faith",
                description: "Mr. Reyes' Class",
                color: "yellow",
                icon: "🔍",
                activities: [
                  {
                    id: 4,
                    title: "Math Challenge",
                    description: "Test your math skills",
                    type: "quiz",
                    status: "new",
                  },
                  {
                    id: 5,
                    title: "Science Explorer",
                    description: "Discover scientific concepts",
                    type: "game",
                    status: "new",
                  },
                ],
                students: [
                  {
                    id: 6,
                    name: "Carlos Tan",
                    email: "carlos@example.com",
                    score: 90,
                    progress: 70,
                    avatar: "👨‍🎓",
                  },
                  {
                    id: 7,
                    name: "Ana Lim",
                    email: "ana@example.com",
                    score: 85,
                    progress: 65,
                    avatar: "👩‍🎓",
                  },
                  {
                    id: 8,
                    name: "Diego Mendoza",
                    email: "diego@example.com",
                    score: 82,
                    progress: 60,
                    avatar: "👨‍🎓",
                  },
                ],
              },
              {
                id: 3,
                name: "Grade 3 - Hope",
                description: "Mrs. Lim's Class",
                color: "green",
                icon: "🌱",
                activities: [
                  {
                    id: 6,
                    title: "English Grammar",
                    description: "Learn grammar rules",
                    type: "quiz",
                    status: "completed",
                  },
                  {
                    id: 7,
                    title: "Reading Comprehension",
                    description: "Improve reading skills",
                    type: "quiz",
                    status: "completed",
                  },
                  {
                    id: 8,
                    title: "Vocabulary Builder",
                    description: "Expand your vocabulary",
                    type: "game",
                    status: "in-progress",
                  },
                ],
                students: [
                  {
                    id: 9,
                    name: "Luis Garcia",
                    email: "luis@example.com",
                    score: 88,
                    progress: 75,
                    avatar: "👨‍🎓",
                  },
                  {
                    id: 10,
                    name: "Sophia Reyes",
                    email: "sophia@example.com",
                    score: 92,
                    progress: 85,
                    avatar: "👩‍🎓",
                  },
                  {
                    id: 11,
                    name: "Gabriel Santos",
                    email: "gabriel@example.com",
                    score: 80,
                    progress: 60,
                    avatar: "👨‍🎓",
                  },
                ],
              },
            ]);
            setLoading(false);
          }, 1500);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  // Calculate level based on total gems
  const calculateLevel = (gems) => {
    if (gems < 100) return { name: "Beginner", progress: (gems / 100) * 100 };
    if (gems < 300)
      return { name: "Explorer", progress: ((gems - 100) / 200) * 100 };
    if (gems < 600)
      return { name: "Champion", progress: ((gems - 300) / 300) * 100 };
    return { name: "Master", progress: 100 };
  };

  const level = calculateLevel(totalGems);

  // Get badges
  const badges = rewards.filter((reward) => reward.type === "BADGE");

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            Loading your adventure...
          </p>
        </div>
      </div>
    );
  }

  if (selectedClassroom) {
    const classroom = classrooms.find((c) => c.id === selectedClassroom);
    return (
      <ClassroomView
        classroom={classroom}
        onBack={() => setSelectedClassroom(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ConfettiEffect active={showConfetti} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logoicon.svg"
              alt="BrightMinds Logo"
              className="h-11 mr-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23FDDF7D' /%3E%3Ctext x='50' y='55' fontFamily='Arial' fontSize='20' textAnchor='middle' fill='%23464655'%3EBM%3C/text%3E%3C/svg%3E";
              }}
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              BrightMinds
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hello, {user?.email}
              </p>
              <div className="flex items-center">
                <Badge color="yellow" className="mr-1">
                  Level {level.name}
                </Badge>
                <Badge color="blue">{totalGems} 💎</Badge>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <span className="text-xl">{selectedAvatar}</span>
              </button>
            </div>
            <ThemeToggle />
            <button onClick={logout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {/* My Classrooms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            My Classrooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                title={classroom.name}
                subtitle={classroom.description}
                icon={classroom.icon}
                color={classroom.color}
                onClick={() => setSelectedClassroom(classroom.id)}
                badge={`${classroom.activities.length} Activities`}
                badgeColor="blue"
              />
            ))}
          </div>
        </div>

        {/* Progress & Achievements*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Section */}
          <AnimatedCard className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              My Progress
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 dark:text-gray-300">
                  Level: {level.name}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalGems} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-400 h-4 rounded-full progress-bar-animated"
                  style={{ width: `${level.progress}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AnimatedCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Total Gems
                </h3>
                <p className="text-2xl font-bold text-yellow-500 flex items-center">
                  {totalGems} <span className="ml-2">💎</span>
                </p>
              </AnimatedCard>
              <AnimatedCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  Quizzes Completed
                </h3>
                <p className="text-2xl font-bold text-blue-500 flex items-center">
                  {progress.length} <span className="ml-2">📝</span>
                </p>
              </AnimatedCard>
            </div>
          </AnimatedCard>

          {/* Achievements Section */}
          <AnimatedCard className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              My Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                      <span className="text-xl">🏆</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white text-center">
                      {badge.badgeName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-4 text-gray-600 dark:text-gray-400 text-center">
                  Complete quizzes to earn badges!
                </p>
              )}
            </div>
          </AnimatedCard>
        </div>

        {showSettings && (
          <UserSettings onClose={() => setShowSettings(false)} />
        )}
      </main>

      {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default StudentDashboard;
