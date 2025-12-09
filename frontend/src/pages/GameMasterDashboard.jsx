import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import BubbleMenu from "@/components/ui/BubbleMenu";
import {
  MostPlayedGamesChart,
  ScoreDistributionChart,
  StudentPerformanceChart,
  CompletionRatesChart,
  RecentActivityList,
  TopPerformersChart,
  StoryMetricsChart,
} from "@/components/charts";
import api from "@/lib/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function GameMasterDashboard() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("students"); // "students", "analytics"
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [studentToReset, setStudentToReset] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("bm_user")) || {};
    setUser(userData);
    if (userData.userId) {
      fetchStudents(userData.userId);
      fetchAnalytics(userData.userId);
    }
  }, []);

  const fetchStudents = async (gameMasterId = null) => {
    try {
      setLoading(true);
      setError("");
      const gmId = gameMasterId || user?.userId;
      if (!gmId) return;

      const response = await api.get("/gamemaster/students", {
        headers: { "X-GameMaster-Id": gmId.toString() },
      });
      setStudents(response.data);
    } catch (e) {
      setError(`Failed to fetch students: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (gameMasterId = null) => {
    try {
      setAnalyticsLoading(true);
      setError("");
      const gmId = gameMasterId || user?.userId;
      if (!gmId) return;

      // 1. Fetch Students List first (if not already)
      let currentStudents = students;
      if (currentStudents.length === 0) {
        const studentRes = await api.get("/gamemaster/students", {
            headers: { "X-GameMaster-Id": gmId.toString() },
        });
        currentStudents = studentRes.data;
        setStudents(currentStudents);
      }

      // 2. Fetch Attempts for ALL 'PLAYER' role students
      const playerStudents = currentStudents.filter(s => s.role === 'PLAYER');
      
      const attemptsPromises = playerStudents.map(student => 
        api.get(`/game-attempts/user/${student.userId}`)
           .then(res => ({ 
             userId: student.userId, 
             name: `${student.firstName || student.fName || "Unknown"} ${student.lastName || student.lName || ""}`.trim(), 
             attempts: res.data || [] 
           }))
           .catch(err => ({ userId: student.userId, name: "Unknown", attempts: [] }))
      );

      const allAttemptsResults = await Promise.all(attemptsPromises);
      
      // 3. Aggregate Data
      // Filter out attempts that are missing critical data like percentage or completion time
      const allAttempts = allAttemptsResults.flatMap(r => 
        r.attempts
          .filter(a => a && typeof a.percentage === 'number' && !isNaN(a.percentage)) 
          .map(a => ({...a, studentName: r.name}))
      );
      
      // --- Summary Metrics ---
      const totalSessions = allAttempts.length;
      const classAverage = allAttempts.length > 0 
        ? Math.round(allAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / allAttempts.length)
        : 0;

      let fastestRun = { time: Infinity, student: "N/A", story: "N/A" };
      let longestRun = { time: 0, student: "N/A", story: "N/A" };

      allAttempts.forEach(a => {
        const time = a.completionTimeSeconds || 0;
        if (time < fastestRun.time && a.percentage === 100) {
            fastestRun = { time: time, student: a.studentName, story: a.storyTitle || `Story ${a.storyId}` };
        }
        if (time > longestRun.time) {
            longestRun = { time: time, student: a.studentName, story: a.storyTitle || `Story ${a.storyId}` };
        }
      });
      if (fastestRun.time === Infinity) fastestRun = { time: 0, student: "N/A", story: "N/A" };

      // --- Top Performers (Avg Score desc, then Avg Time asc) ---
      const studentStats = {};
      allAttempts.forEach(a => {
        if (!studentStats[a.studentName]) studentStats[a.studentName] = { totalScore: 0, totalTime: 0, count: 0 };
        studentStats[a.studentName].totalScore += (a.percentage || 0);
        studentStats[a.studentName].totalTime += (a.completionTimeSeconds || 0);
        studentStats[a.studentName].count += 1;
      });

      const topPerformersData = Object.entries(studentStats).map(([name, stats]) => ({
        studentName: name,
        averageScore: Math.round(stats.totalScore / stats.count),
        averageTime: Math.round(stats.totalTime / stats.count),
        formattedTime: `${Math.floor(stats.totalTime / stats.count / 60)}m ${Math.round((stats.totalTime / stats.count) % 60)}s`
      })).sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return a.averageTime - b.averageTime; // Lower time is better
      }).slice(0, 10);

      // --- Story Metrics (Avg Score & Avg Time per Story) ---
      const storyStats = {};
      allAttempts.forEach(a => {
        const title = a.storyTitle || `Story ${a.storyId}`;
        if (!storyStats[title]) storyStats[title] = { totalScore: 0, totalTime: 0, count: 0 };
        storyStats[title].totalScore += (a.percentage || 0);
        storyStats[title].totalTime += (a.completionTimeSeconds || 0);
        storyStats[title].count += 1;
      });

      const storyMetricsData = Object.entries(storyStats).map(([title, stats]) => ({
        storyTitle: title,
        avgScore: Math.round(stats.totalScore / stats.count),
        avgTimeMinutes: parseFloat((stats.totalTime / stats.count / 60).toFixed(1)),
        avgTimeSeconds: Math.round(stats.totalTime / stats.count)
      }));

      // --- Recent Activity (Flattened & Sorted) ---
      const isValidDate = (d) => d instanceof Date && !isNaN(d);

      const recentActivity = allAttempts
        .filter(a => {
            if (!a.endAttemptDate) return false;
            const date = new Date(a.endAttemptDate);
            return isValidDate(date);
        }) 
        .sort((a, b) => new Date(b.endAttemptDate) - new Date(a.endAttemptDate))
        .map(a => ({
            studentName: a.studentName,
            storyTitle: a.storyTitle || `Story ${a.storyId}`,
            date: a.endAttemptDate,
            score: a.percentage
        }));

      setAnalytics({
        summary: { totalSessions, classAverage, fastestRun, longestRun },
        topPerformers: topPerformersData,
        storyMetrics: storyMetricsData,
        recentActivity: recentActivity
      });

    } catch (e) {
      setError(`Failed to fetch analytics: ${e.message || e}`);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ... (Upload/Export handlers remain the same) ...
  const handleFileUpload = async () => {
    if (!uploadFile || !user?.userId) return;

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setLoading(true);
      setError("");
      await api.post("/gamemaster/students/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-GameMaster-Id": user.userId.toString(),
        },
      });
      setSuccess("Students imported successfully!");
      setShowUploadModal(false);
      setUploadFile(null);
      fetchStudents(user.userId);
    } catch (e) {
      setError(`Failed to upload file: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportStudents = async () => {
    if (!students || students.length === 0) return;

    try {
      setLoading(true);
      setError("");

      // 1. Fetch attempts for ALL students (reusing logic or parallel fetch)
      // We need this data to get scores
      const attemptsPromises = students
        .filter(s => s.role === 'PLAYER')
        .map(student => 
          api.get(`/game-attempts/user/${student.userId}`)
             .then(res => ({ 
               email: student.email,
               firstName: student.firstName || student.fName, 
               lastName: student.lastName || student.lName,
               attempts: res.data || [] 
             }))
             .catch(err => ({ email: student.email, firstName: student.firstName || student.fName, lastName: student.lastName || student.lName, attempts: [] }))
        );

      const allData = await Promise.all(attemptsPromises);

      // 2. Identify all unique games (stories) played to create dynamic columns
      const allStoriesSet = new Set();
      allData.forEach(studentData => {
        studentData.attempts.forEach(a => {
           if (a.storyTitle) allStoriesSet.add(a.storyTitle);
           else if (a.storyId) allStoriesSet.add(`Story ${a.storyId}`);
        });
      });
      const sortedStories = Array.from(allStoriesSet).sort();

      // 3. Construct Rows
      // Headers: Email | Fname | Lname | Game1 | Game2 ...
      const headers = ["Email", "First Name", "Last Name", ...sortedStories];
      
      const rows = allData.map(student => {
        const row = {
          "Email": student.email,
          "First Name": student.firstName,
          "Last Name": student.lastName
        };

        // For each story, find the BEST attempt (highest score) and format as "Score/Total"
        sortedStories.forEach(storyTitle => {
          const attemptsForStory = student.attempts.filter(a => (a.storyTitle || `Story ${a.storyId}`) === storyTitle);
          
          if (attemptsForStory.length > 0) {
            // Find max score attempt
            const bestAttempt = attemptsForStory.reduce((prev, current) => 
              (prev.score || 0) > (current.score || 0) ? prev : current
            );
            
            // Format: "36/36"
            // Ensure we hava safe numbers. If totalPossibleScore is missing, fallback to percentage?
            // "GameAttempt" entity usually returns score and totalPossibleScore.
            if (bestAttempt.score !== undefined && bestAttempt.totalPossibleScore) {
               row[storyTitle] = `${bestAttempt.score}/${bestAttempt.totalPossibleScore}`;
            } else {
               // Fallback if raw scores aren't available (though they should be)
               row[storyTitle] = `${Math.round(bestAttempt.percentage)}%`;
            }
          } else {
            row[storyTitle] = "-";
          }
        });
        return row;
      });

      // 4. Generate Excel
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
      
      // Auto-width columns
      const cols = headers.map(h => ({ wch: Math.max(h.length, 15) }));
      worksheet['!cols'] = cols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Scores");

      // 5. Save file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
      saveAs(data, `Student_Export_${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (e) {
      console.error(e);
      setError(`Failed to export students: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (studentId) => {
    const student = students.find((s) => s.userId === studentId);
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete || !user?.userId) return;

    try {
      setLoading(true);
      setError("");
      await api.delete(`/gamemaster/student/${studentToDelete.userId}`, {
        headers: { "X-GameMaster-Id": user.userId.toString() },
      });
      setSuccess("Student deleted successfully!");
      fetchStudents(user.userId);
    } catch (e) {
      setError(`Failed to delete student: ${e.message || e}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
    }
  };

  const handleResetPassword = (studentId) => {
    const student = students.find((s) => s.userId === studentId);
    setStudentToReset(student);
    setShowResetConfirm(true);
  };

  const confirmResetPassword = async () => {
    if (!studentToReset || !user?.userId) return;

    try {
      setLoading(true);
      setError("");
      await api.post(
        `/gamemaster/student/${studentToReset.userId}/reset-password`,
        {},
        { headers: { "X-GameMaster-Id": user.userId.toString() } }
      );
      setSuccess("Student password reset successfully! Default: brightmindsplayer");
      fetchStudents(user.userId);
    } catch (e) {
      setError(`Failed to reset password: ${e.message || e}`);
    } finally {
      setLoading(false);
      setShowResetConfirm(false);
      setStudentToReset(null);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-bmGreen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bmGreen text-bmBlack">
      <BubbleMenu useFixedPosition />

      {/* Header */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-white border-4 border-bmBlack shadow-[6px_6px_0_#000] px-8 py-4 transform -rotate-1 hover:rotate-0 transition-transform duration-200">
            <h1 className="text-3xl md:text-5xl font-spartan font-black text-bmBlack uppercase tracking-tight text-center">
              Welcome, <span className="text-bmBlack">
                {user.firstName || user.fName || "Teacher"}
              </span>!
            </h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex justify-center mb-6">
          <div className="bg-bmLightYellow border-4 border-bmBlack rounded-lg p-1 shadow-[4px_4px_0_#000]">
            <div className="flex gap-1">
              <Button
                onClick={() => setActiveTab("students")}
                className={`px-6 py-2 font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] ${
                  activeTab === "students"
                    ? "bg-bmYellow text-bmBlack"
                    : "bg-white text-bmBlack hover:bg-gray-100"
                }`}>
                Students
              </Button>
              <Button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-2 font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] ${
                  activeTab === "analytics"
                    ? "bg-bmYellow text-bmBlack"
                    : "bg-white text-bmBlack hover:bg-gray-100"
                }`}>
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Global Messages */}
        {error && (
          <div className="bg-bmRed text-white p-4 rounded-lg border-2 border-bmBlack text-center font-lexend mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-bmGreen text-white p-4 rounded-lg border-2 border-bmBlack text-center font-lexend mb-6">
            {success}
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === "students" && (
            <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
              <CardHeader>
                <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                  Your Players
                </CardTitle>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                    disabled={loading}>
                    Import Students
                  </Button>
                  <Button
                    onClick={handleExportStudents}
                    className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                    disabled={loading}>
                    Export Students
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center text-bmBlack font-lexend">
                    Loading students...
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center text-bmBlack font-lexend">
                    No students found. Import some students to get started!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div
                        key={student.userId}
                        className="bg-white border-2 border-bmBlack rounded-lg p-4 flex justify-between items-center">
                        <div className="font-lexend">
                          <div className="font-bold text-bmBlack text-lg">
                            {student.firstName || student.fName} {student.lastName || student.lName}
                          </div>
                          <div className="text-bmBlack text-sm opacity-80">
                            {student.email}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleResetPassword(student.userId)}
                            className="bg-bmOrange hover:bg-orange-600 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] text-xs h-8 px-3"
                            disabled={loading}>
                            Reset Password
                          </Button>
                          <Button
                            onClick={() => handleDeleteStudent(student.userId)}
                            className="bg-bmRed hover:bg-red-700 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] text-xs h-8 px-3"
                            disabled={loading}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <>
              {analytics ? (
                <div className="space-y-8">
                  <h2 className="text-3xl font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
                    ANALYTICS DASHBOARD
                  </h2>

                  {/* Summary Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {/* Class Average */}
                    <div className="bg-white border-2 border-bmBlack shadow-[4px_4px_0_#000] rounded-lg p-4 text-center">
                      <div className="text-sm font-lexend text-gray-500 uppercase tracking-wider mb-1">Class Average</div>
                      <div className="text-3xl font-spartan font-black text-bmBlack">
                         {analytics.summary.classAverage}%
                      </div>
                    </div>

                    {/* Total Sessions */}
                    <div className="bg-white border-2 border-bmBlack shadow-[4px_4px_0_#000] rounded-lg p-4 text-center">
                      <div className="text-sm font-lexend text-gray-500 uppercase tracking-wider mb-1">Total Sessions</div>
                      <div className="text-3xl font-spartan font-black text-bmBlack">
                        {analytics.summary.totalSessions}
                      </div>
                    </div>

                    {/* Fastest Run */}
                    <div className="bg-white border-2 border-bmBlack shadow-[4px_4px_0_#000] rounded-lg p-4 text-center">
                      <div className="text-sm font-lexend text-gray-500 uppercase tracking-wider mb-1">Fastest Perfect Run</div>
                      <div className="text-xl font-spartan font-bold text-bmBlack truncate">
                         {analytics.summary.fastestRun.time > 0 
                            ? `${Math.floor(analytics.summary.fastestRun.time/60)}m ${analytics.summary.fastestRun.time%60}s` 
                            : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{analytics.summary.fastestRun.student}</div>
                    </div>
                    
                    {/* Longest Run */}
                    <div className="bg-white border-2 border-bmBlack shadow-[4px_4px_0_#000] rounded-lg p-4 text-center">
                      <div className="text-sm font-lexend text-gray-500 uppercase tracking-wider mb-1">Longest Session</div>
                      <div className="text-xl font-spartan font-bold text-bmBlack truncate">
                         {analytics.summary.longestRun.time > 0 
                            ? `${Math.floor(analytics.summary.longestRun.time/60)}m ${analytics.summary.longestRun.time%60}s` 
                            : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{analytics.summary.longestRun.student}</div>
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div>
                    <TopPerformersChart data={analytics.topPerformers} />
                  </div>

                  {/* Story Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StoryMetricsChart 
                        data={analytics.storyMetrics} 
                        title="Average Score per Story" 
                        dataKey="avgScore" 
                        color="#3b82f6" 
                        unit="%" 
                        yAxisDomain={[0, 100]}
                    />
                    <StoryMetricsChart 
                        data={analytics.storyMetrics} 
                        title="Average Time per Story" 
                        dataKey="avgTimeMinutes" 
                        color="#10b981" 
                        unit=" min" 
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-8">
                    <RecentActivityList data={analytics.recentActivity} />
                  </div>
                </div>
              ) : (
                <div className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000] rounded-lg p-8">
                  <div className="text-center text-bmBlack font-lexend">
                    {analyticsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bmBlack mx-auto mb-4"></div>
                        Fetching class data...
                      </>
                    ) : (
                      "No analytics data available."
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
              Import Students
            </DialogTitle>
            <DialogDescription className="text-center text-bmBlack">
              Upload an Excel file to import student accounts
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 font-lexend">
            {/* Interactive File Input */}
            <div className="grid gap-2">
              <Label htmlFor="file" className="text-bmBlack font-bold">
                Upload Excel File
              </Label>
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="hidden" // Hide the default input
                />
                <label 
                  htmlFor="file" 
                  className={`
                    flex flex-col items-center justify-center w-full h-32 
                    border-2 border-dashed border-bmBlack rounded-lg 
                    bg-white hover:bg-gray-50 cursor-pointer 
                    transition-colors duration-200
                    ${uploadFile ? 'bg-bmLightYellow border-solid' : ''}
                  `}
                >
                  {uploadFile ? (
                    <div className="text-center">
                      <p className="font-bold text-bmBlack text-lg mb-1">File Selected!</p>
                      <p className="text-sm text-gray-600">{uploadFile.name}</p>
                      <p className="text-xs text-bmOrange mt-2 font-bold group-hover:underline">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="mb-2 text-3xl">📂</div>
                      <p className="font-bold text-bmBlack">Click or drag to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Accepts .xlsx or .xls</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* File Format Table */}
            <div className="bg-white p-4 rounded border-2 border-bmBlack shadow-[2px_2px_0_#000]">
              <p className="font-bold text-bmBlack mb-2 text-sm">Required File Format:</p>
              <div className="overflow-x-auto border border-bmBlack rounded">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-100 border-b border-bmBlack">
                    <tr>
                      <th className="px-3 py-2 border-r border-bmBlack">Email</th>
                      <th className="px-3 py-2 border-r border-bmBlack">First Name</th>
                      <th className="px-3 py-2">Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-3 py-2 border-r border-bmBlack font-mono text-xs">sample@cit.edu</td>
                      <td className="px-3 py-2 border-r border-bmBlack">Juan</td>
                      <td className="px-3 py-2">Dela Cruz</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-bmBlack mt-3">
                <span className="font-bold text-bmOrange">Note:</span> Default password for all imports is: <strong>brightmindsplayer</strong>
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row">
            <Button
              onClick={() => setShowUploadModal(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
              disabled={loading || !uploadFile}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-center text-bmBlack font-lexend mt-2">
              Are you sure you want to delete <strong>{studentToDelete?.firstName} {studentToDelete?.lastName}</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteStudent}
              className="bg-bmRed hover:bg-red-700 text-white font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
              disabled={loading}>
              {loading ? "Deleting..." : "Delete Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Password Reset Confirmation Modal */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
              Confirm Password Reset
            </DialogTitle>
            <DialogDescription className="text-center text-bmBlack font-lexend mt-2">
              Are you sure you want to reset the password for <strong>{studentToReset?.firstName} {studentToReset?.lastName}</strong>?
              <br />
              The password will be reset to: <strong>brightmindsplayer</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              onClick={() => setShowResetConfirm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
              Cancel
            </Button>
            <Button
              onClick={confirmResetPassword}
              className="bg-bmOrange hover:bg-orange-600 text-white font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
              disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
