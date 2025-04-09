"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedCard from "../components/AnimatedCard";
import Badge from "../components/Badge";
import ClassroomCard from "../components/ClassroomCard";
import ClassroomView from "../components/ClassroomView";
import UserSettings from "../components/UserSettings";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    description: "",
    color: "primary",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Simulate API call with mock data
          setTimeout(() => {
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
                    status: "active",
                  },
                  {
                    id: 2,
                    title: "Mga Lalawigan ng Pilipinas",
                    description: "Explore Philippine provinces",
                    type: "game",
                    status: "active",
                  },
                  {
                    id: 3,
                    title: "Mga Tradisyon ng Pilipinas",
                    description: "Discover Filipino traditions",
                    type: "quiz",
                    status: "draft",
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
                    status: "active",
                  },
                  {
                    id: 5,
                    title: "Science Explorer",
                    description: "Discover scientific concepts",
                    type: "game",
                    status: "draft",
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
                    status: "active",
                  },
                  {
                    id: 7,
                    title: "Reading Comprehension",
                    description: "Improve reading skills",
                    type: "quiz",
                    status: "active",
                  },
                  {
                    id: 8,
                    title: "Vocabulary Builder",
                    description: "Expand your vocabulary",
                    type: "game",
                    status: "draft",
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

  const handleCreateClassroom = (e) => {
    e.preventDefault();
    const newClassroomData = {
      id: classrooms.length + 1,
      ...newClassroom,
      icon: "📚",
      activities: [],
      students: [],
    };
    setClassrooms([...classrooms, newClassroomData]);
    setShowCreateClassroom(false);
    setNewClassroom({
      name: "",
      description: "",
      color: "primary",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            Loading your dashboard...
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
        isTeacher={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <Badge color="green">Teacher</Badge>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 dark:text-green-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome, Teacher!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your classrooms and create engaging activities for your
            students.
          </p>
        </div>

        {/* My Classrooms */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Classrooms
            </h2>
            <button
              onClick={() => setShowCreateClassroom(true)}
              className="btn-primary flex items-center">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Classroom
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                title={classroom.name}
                subtitle={classroom.description}
                icon={classroom.icon}
                color={classroom.color}
                onClick={() => setSelectedClassroom(classroom.id)}
                badge={`${classroom.students.length} Students`}
                badgeColor="green"
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {classrooms.reduce(
                (total, classroom) => total + classroom.students.length,
                0
              )}
            </p>
            <div className="mt-2 text-blue-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Across all classrooms
            </div>
          </AnimatedCard>
          <AnimatedCard className="p-6 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Total Activities
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {classrooms.reduce(
                (total, classroom) => total + classroom.activities.length,
                0
              )}
            </p>
            <div className="mt-2 text-yellow-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Created for students
            </div>
          </AnimatedCard>
          <AnimatedCard className="p-6 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Active Classrooms
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {classrooms.length}
            </p>
            <div className="mt-2 text-green-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Currently managed
            </div>
          </AnimatedCard>
        </div>
      </main>

      {/* Create Classroom Modal */}
      {showCreateClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AnimatedCard className="max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Create New Classroom
              </h2>
              <button
                onClick={() => setShowCreateClassroom(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
                ✕
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateClassroom} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Classroom Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newClassroom.name}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, name: e.target.value })
                    }
                    className="input-enhanced"
                    placeholder="e.g., Grade 3 - Joy"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={newClassroom.description}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        description: e.target.value,
                      })
                    }
                    className="input-enhanced"
                    placeholder="e.g., Ms. Santos' Class"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewClassroom({ ...newClassroom, color: "primary" })
                      }
                      className={`w-full h-10 rounded-md ${
                        newClassroom.color === "primary"
                          ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                          : ""
                      } bg-blue-500`}></button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewClassroom({ ...newClassroom, color: "yellow" })
                      }
                      className={`w-full h-10 rounded-md ${
                        newClassroom.color === "yellow"
                          ? "ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-900"
                          : ""
                      } bg-yellow-400`}></button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewClassroom({ ...newClassroom, color: "green" })
                      }
                      className={`w-full h-10 rounded-md ${
                        newClassroom.color === "green"
                          ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900"
                          : ""
                      } bg-green-500`}></button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewClassroom({ ...newClassroom, color: "purple" })
                      }
                      className={`w-full h-10 rounded-md ${
                        newClassroom.color === "purple"
                          ? "ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900"
                          : ""
                      } bg-purple-500`}></button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateClassroom(false)}
                    className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Classroom
                  </button>
                </div>
              </form>
            </div>
          </AnimatedCard>
        </div>
      )}

      {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default TeacherDashboard;
