import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import GamePageMCQ from "@/pages/GamePageMCQ";
import GamePageDnD from "@/pages/GamePageDnD";
import GamePageSEQ from "@/pages/GamePageSEQ";

export default function GameRouter() {
  const { storyId } = useParams();
  const [gameplayType, setGameplayType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch story data to determine gameplay type
        const response = await api.get(`/stories/${storyId}`);
        const storyData = response.data;

        console.log("Story data loaded for routing:", storyData);

        // Set gameplay type, defaulting to "MCQ" if not specified
        const type = storyData.gameplayType || "MCQ";
        setGameplayType(type);

        console.log(`Routing to ${type} component for story ${storyId}`);
      } catch (err) {
        console.error("Error loading story data for routing:", err);
        setError("Failed to load story data. Please try again.");
        // Default to MCQ if there's an error
        setGameplayType("MCQ");
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStoryData();
    }
  }, [storyId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-bmGreen flex items-center justify-center">
        <div className="text-white font-pressStart">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-bmGreen flex items-center justify-center">
        <div className="text-white font-pressStart text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-bmYellow text-bmBlack px-4 py-2 rounded font-pressStart">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Route based on gameplay type
  switch (gameplayType) {
    case "DragDrop":
      return <GamePageDnD />;
    case "Sequence":
      return <GamePageSEQ />;
    case "MCQ":
    default:
      return <GamePageMCQ />;
  }
}
