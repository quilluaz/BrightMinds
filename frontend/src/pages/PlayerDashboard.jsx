import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import BubbleMenu from "@/components/ui/BubbleMenu";
import api from "@/lib/api";

export default function PlayerDashboard() {
  const [user, setUser] = useState(null);
  const [gameAttempts, setGameAttempts] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "history", "badges"

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("bm_user")) || {};
    setUser(userData);
    if (userData.userId) {
      fetchDashboardData(userData.userId);
    }
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      setError("");

      // Fetch data in parallel
      const [attemptsResponse, badgesResponse, allBadgesResponse] =
        await Promise.all([
          api.get(`/game-attempts/user/${userId}`),
          api.get(`/user-badges/user/${userId}/with-badge`),
          api.get("/badges"),
        ]);

      setGameAttempts(attemptsResponse.data || []);
      setUserBadges(badgesResponse.data || []);
      setAllBadges(allBadgesResponse.data || []);
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
      setError(`Failed to load dashboard data: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 90) return "bg-green-100 border-green-300";
    if (percentage >= 75) return "bg-yellow-100 border-yellow-300";
    if (percentage >= 60) return "bg-orange-100 border-orange-300";
    return "bg-red-100 border-red-300";
  };

  const getBadgeEarnedStatus = (badgeId) => {
    return userBadges.some((userBadge) => userBadge.badgeId === badgeId);
  };

  const getBadgeProgress = (badge) => {
    // This is a simplified progress calculation
    // In a real implementation, you'd calculate based on the badge condition
    const earned = getBadgeEarnedStatus(badge.badgeId);
    return earned ? 100 : 0;
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
      <BubbleMenu />

      {/* Header */}
      <div className="bg-bmYellow border-b-4 border-bmBlack p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
            PLAYER DASHBOARD
          </h1>
          <p className="text-center text-bmBlack font-lexend mt-2">
            Welcome back, {user.fName} {user.lName}!
          </p>
          <p className="text-center text-bmBlack font-lexend text-sm">
            Player ID: {user.userId} | Role: {user.role}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center mb-6">
          <div className="bg-bmLightYellow border-4 border-bmBlack rounded-lg p-1 shadow-[4px_4px_0_#000]">
            <div className="flex gap-1">
              <Button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-2 font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] ${
                  activeTab === "overview"
                    ? "bg-bmYellow text-bmBlack"
                    : "bg-white text-bmBlack hover:bg-gray-100"
                }`}>
                Overview
              </Button>
              <Button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] ${
                  activeTab === "history"
                    ? "bg-bmYellow text-bmBlack"
                    : "bg-white text-bmBlack hover:bg-gray-100"
                }`}>
                Match History
              </Button>
              <Button
                onClick={() => setActiveTab("badges")}
                className={`px-6 py-2 font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000] ${
                  activeTab === "badges"
                    ? "bg-bmYellow text-bmBlack"
                    : "bg-white text-bmBlack hover:bg-gray-100"
                }`}>
                Badges
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-bmRed text-white p-4 rounded-lg border-2 border-bmBlack text-center font-lexend mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white font-lexend mb-6">
            Loading dashboard data...
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                    Total Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                    {gameAttempts.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                    {userBadges.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                    {gameAttempts.length > 0
                      ? Math.round(
                          gameAttempts.reduce(
                            (sum, attempt) => sum + (attempt.percentage || 0),
                            0
                          ) / gameAttempts.length
                        )
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                    Best Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                    {gameAttempts.length > 0
                      ? Math.round(
                          Math.max(
                            ...gameAttempts.map(
                              (attempt) => attempt.percentage || 0
                            )
                          )
                        )
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Games */}
            <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
              <CardHeader>
                <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameAttempts.length === 0 ? (
                  <div className="text-center text-bmBlack font-lexend">
                    No games played yet. Start playing to see your history!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gameAttempts.slice(0, 5).map((attempt) => (
                      <div
                        key={attempt.attemptId}
                        className="bg-white border-2 border-bmBlack rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-spartan font-bold text-bmBlack">
                              {attempt.storyTitle || `Story ${attempt.storyId}`}
                            </h3>
                            <p className="font-lexend text-bmBlack text-sm">
                              {formatDate(attempt.endAttemptDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-spartan font-black ${getScoreColor(
                                attempt.percentage
                              )}`}>
                              {Math.round(attempt.percentage || 0)}%
                            </div>
                            <p className="font-lexend text-bmBlack text-sm">
                              {formatDuration(attempt.completionTimeSeconds)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
              <CardHeader>
                <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBadges.length === 0 ? (
                  <div className="text-center text-bmBlack font-lexend">
                    No badges earned yet. Keep playing to earn your first badge!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userBadges.slice(0, 6).map((userBadge) => (
                      <div
                        key={userBadge.userBadgeId}
                        className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-bmYellow border-2 border-bmBlack rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="font-spartan font-bold text-bmBlack text-sm">
                          {userBadge.badge?.name || "Unknown Badge"}
                        </h3>
                        <p className="font-lexend text-bmBlack text-xs">
                          {formatDate(userBadge.earnedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Match History Tab */}
        {activeTab === "history" && (
          <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
            <CardHeader>
              <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                Complete Match History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gameAttempts.length === 0 ? (
                <div className="text-center text-bmBlack font-lexend">
                  No games played yet. Start playing to see your history!
                </div>
              ) : (
                <div className="space-y-4">
                  {gameAttempts.map((attempt) => (
                    <div
                      key={attempt.attemptId}
                      className="bg-white border-2 border-bmBlack rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <h3 className="font-spartan font-bold text-bmBlack text-lg">
                            {attempt.storyTitle || `Story ${attempt.storyId}`}
                          </h3>
                          <p className="font-lexend text-bmBlack text-sm">
                            {formatDate(attempt.endAttemptDate)}
                          </p>
                        </div>

                        <div className="text-center">
                          <div
                            className={`text-3xl font-spartan font-black ${getScoreColor(
                              attempt.percentage
                            )}`}>
                            {Math.round(attempt.percentage || 0)}%
                          </div>
                          <p className="font-lexend text-bmBlack text-sm">
                            {attempt.score || 0} /{" "}
                            {attempt.totalPossibleScore || 0} points
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-spartan font-bold text-bmBlack">
                            {formatDuration(attempt.completionTimeSeconds)}
                          </div>
                          <p className="font-lexend text-bmBlack text-sm">
                            Duration
                          </p>
                        </div>

                        <div className="text-center">
                          <div
                            className={`inline-block px-3 py-1 rounded-full border-2 ${getScoreBadgeColor(
                              attempt.percentage
                            )}`}>
                            <span className="font-lexend font-bold text-sm">
                              {attempt.percentage >= 90
                                ? "Excellent"
                                : attempt.percentage >= 75
                                ? "Good"
                                : attempt.percentage >= 60
                                ? "Passing"
                                : "Needs Improvement"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            {/* Badge Progress Summary */}
            <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
              <CardHeader>
                <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                  Badge Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-spartan font-black text-bmBlack mb-2">
                    {userBadges.length} / {allBadges.length}
                  </div>
                  <p className="font-lexend text-bmBlack">Badges Earned</p>
                  <div className="w-full bg-white border-2 border-bmBlack rounded-full h-4 mt-4">
                    <div
                      className="bg-bmYellow h-full rounded-full border-2 border-bmBlack"
                      style={{
                        width: `${
                          allBadges.length > 0
                            ? (userBadges.length / allBadges.length) * 100
                            : 0
                        }%`,
                      }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Badges Grid */}
            <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
              <CardHeader>
                <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
                  All Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allBadges.length === 0 ? (
                  <div className="text-center text-bmBlack font-lexend">
                    No badges available yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allBadges.map((badge) => {
                      const isEarned = getBadgeEarnedStatus(badge.badgeId);
                      const progress = getBadgeProgress(badge);
                      const userBadge = userBadges.find(
                        (ub) => ub.badgeId === badge.badgeId
                      );

                      return (
                        <div
                          key={badge.badgeId}
                          className={`border-2 border-bmBlack rounded-lg p-4 text-center ${
                            isEarned ? "bg-bmYellow" : "bg-white"
                          }`}>
                          <div
                            className={`w-20 h-20 border-2 border-bmBlack rounded-full mx-auto mb-3 flex items-center justify-center ${
                              isEarned ? "bg-bmYellow" : "bg-gray-200"
                            }`}>
                            <span className="text-3xl">
                              {isEarned ? "🏆" : "🔒"}
                            </span>
                          </div>
                          <h3 className="font-spartan font-bold text-bmBlack text-sm mb-2">
                            {badge.name}
                          </h3>
                          <p className="font-lexend text-bmBlack text-xs mb-3">
                            {badge.description}
                          </p>
                          {isEarned && userBadge && (
                            <p className="font-lexend text-bmBlack text-xs">
                              Earned: {formatDate(userBadge.earnedAt)}
                            </p>
                          )}
                          {!isEarned && (
                            <div className="w-full bg-gray-200 border border-bmBlack rounded-full h-2">
                              <div
                                className="bg-bmYellow h-full rounded-full"
                                style={{ width: `${progress}%` }}></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
