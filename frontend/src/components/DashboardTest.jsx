import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

/**
 * Test component for dashboard functionality
 * This component can be temporarily added to test the badge and game attempt APIs
 */
export default function DashboardTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const testBadgeSeeding = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/seeder/badges");
      setResult(`Badge seeding result: ${response.data}`);
    } catch (e) {
      setError(`Error seeding badges: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBadgeManagement = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/badge-management/seed-badges");
      setResult(`Badge management result: ${response.data}`);
    } catch (e) {
      setError(`Error with badge management: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetBadges = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/badges");
      setResult(`Found ${response.data.length} badges: ${response.data.map(b => b.name).join(", ")}`);
    } catch (e) {
      setError(`Error fetching badges: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetUserBadges = async () => {
    try {
      setLoading(true);
      setError("");
      const user = JSON.parse(localStorage.getItem("bm_user")) || {};
      if (!user.userId) {
        setError("No user found in localStorage");
        return;
      }
      const response = await api.get(`/user-badges/user/${user.userId}/with-badge`);
      setResult(`User has ${response.data.length} badges: ${response.data.map(ub => ub.badge?.name || "Unknown").join(", ")}`);
    } catch (e) {
      setError(`Error fetching user badges: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetGameAttempts = async () => {
    try {
      setLoading(true);
      setError("");
      const user = JSON.parse(localStorage.getItem("bm_user")) || {};
      if (!user.userId) {
        setError("No user found in localStorage");
        return;
      }
      const response = await api.get(`/game-attempts/user/${user.userId}`);
      setResult(`User has ${response.data.length} game attempts`);
    } catch (e) {
      setError(`Error fetching game attempts: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border-2 border-bmBlack rounded-lg shadow-[4px_4px_0_#000]">
      <h2 className="text-2xl font-spartan font-bold text-bmBlack mb-4">
        Dashboard API Test
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testBadgeSeeding}
            disabled={loading}
            className="bg-bmYellow hover:bg-bmOrange text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
            Seed Badges (Seeder)
          </Button>
          
          <Button
            onClick={testBadgeManagement}
            disabled={loading}
            className="bg-bmYellow hover:bg-bmOrange text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
            Seed Badges (Management)
          </Button>
          
          <Button
            onClick={testGetBadges}
            disabled={loading}
            className="bg-bmGreen hover:bg-green-600 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
            Get All Badges
          </Button>
          
          <Button
            onClick={testGetUserBadges}
            disabled={loading}
            className="bg-bmGreen hover:bg-green-600 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
            Get User Badges
          </Button>
          
          <Button
            onClick={testGetGameAttempts}
            disabled={loading}
            className="bg-bmIndigo hover:bg-indigo-600 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
            Get Game Attempts
          </Button>
        </div>

        {loading && (
          <div className="text-bmBlack font-lexend">
            Loading...
          </div>
        )}

        {result && (
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
            <h3 className="font-spartan font-bold text-green-800 mb-2">Result:</h3>
            <p className="font-lexend text-green-700">{result}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
            <h3 className="font-spartan font-bold text-red-800 mb-2">Error:</h3>
            <p className="font-lexend text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
