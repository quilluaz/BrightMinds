import { useState } from "react";
import AnimatedCard from "./AnimatedCard";
import Badge from "./Badge";

const ClassroomView = ({ classroom, onBack, isTeacher = false }) => {
  const [activeTab, setActiveTab] = useState("activities");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {classroom.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {classroom.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
                activeTab === "activities"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
              }`}>
              {isTeacher ? "Manage Activities" : "Activities"}
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
                activeTab === "leaderboard"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
              }`}>
              Leaderboard
            </button>
            {isTeacher && (
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
                  activeTab === "students"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
                }`}>
                Students
              </button>
            )}
            {isTeacher && (
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
                }`}>
                Analytics
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4">
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isTeacher && (
              <AnimatedCard className="p-4 flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mb-2">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Create New Activity
                </p>
              </AnimatedCard>
            )}

            {classroom.activities.map((activity) => (
              <AnimatedCard key={activity.id} className="p-4 cursor-pointer">
                <div className="flex items-start mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3">
                    {activity.type === "quiz"
                      ? "📝"
                      : activity.type === "game"
                      ? "🎮"
                      : "📚"}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge
                    color={
                      activity.status === "completed"
                        ? "green"
                        : activity.status === "in-progress"
                        ? "yellow"
                        : "blue"
                    }>
                    {activity.status === "completed"
                      ? "Completed"
                      : activity.status === "in-progress"
                      ? "In Progress"
                      : "New"}
                  </Badge>
                  {isTeacher && (
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-600">
                        Edit
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <AnimatedCard className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Classroom Leaderboard
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {classroom.students
                  .sort((a, b) => b.score - a.score)
                  .map((student, index) => (
                    <div
                      key={student.id}
                      className={`flex items-center p-3 rounded-lg ${
                        index === 0
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                          : index === 1
                          ? "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                          : index === 2
                          ? "bg-yellow-900/10 dark:bg-yellow-900/10 border border-yellow-700 dark:border-yellow-900"
                          : "bg-white dark:bg-gray-800"
                      }`}>
                      <div className="w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}`}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <span className="text-xl">{student.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.score} points
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </AnimatedCard>
        )}

        {activeTab === "students" && isTeacher && (
          <AnimatedCard className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Students
              </h2>
              <button className="btn-primary text-sm py-1">Add Student</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {classroom.students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                            <span className="text-lg">{student.avatar}</span>
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {student.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${student.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-500 hover:text-blue-600 mr-3">
                          View
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        )}

        {activeTab === "analytics" && isTeacher && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedCard className="p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                Activity Completion Rate
              </h3>
              <div className="h-40 bg-blue-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization would go here
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard className="p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                Average Score
              </h3>
              <div className="h-40 bg-yellow-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization would go here
                </p>
              </div>
            </AnimatedCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomView;
