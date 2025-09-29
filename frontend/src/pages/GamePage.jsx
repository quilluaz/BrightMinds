import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";
import AnimatedSprite from "@/components/ui/AnimatedSprite";

export default function GamePage() {
  const { storyId } = useParams();

  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, question, finished
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentSceneData, setCurrentSceneData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [error, setError] = useState("");

  const isTransitioning = useRef(false);

  // Fetch the story's scene list when the component mounts
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setGameState("loading");
        const scenesResponse = await api.get(`/stories/${storyId}/scenes`);
        if (!scenesResponse.data || scenesResponse.data.length === 0) {
          throw new Error("No scenes found for this story.");
        }
        setScenes(scenesResponse.data);
        await loadScene(scenesResponse.data[0].sceneId);
        setGameState("intro");
      } catch (err) {
        handleError("Could not load the story. Please try again later.", err);
      }
    };
    if (storyId) {
      fetchStoryData();
    }
  }, [storyId]);

  const handleError = (message, error) => {
    console.error(message, error);
    setError(message);
    setGameState("error");
  };

  // Load all data for a single scene
  const loadScene = async (sceneId) => {
    if (!sceneId) return;
    try {
      const { data: gameScene } = await api.get(`/game/scene/${sceneId}`);
      setCurrentSceneData(gameScene);
    } catch (err) {
      handleError("A problem occurred while loading the scene.", err);
    }
  };

  // Handle user clicks to advance the story
  const handleInteraction = async () => {
    if (
      isTransitioning.current ||
      ["question", "finished", "loading"].includes(gameState)
    ) {
      return;
    }

    if (gameState === "intro") {
      setGameState("playing");
      return;
    }

    if (currentSceneData?.question) {
      setGameState("question");
    } else {
      goToNextScene();
    }
  };

  const handleAnswerSelection = (choice) => {
    if (isAnswerLocked) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [choice.choiceId]: choice.isCorrect ? "correct" : "incorrect",
    }));

    if (choice.isCorrect) {
      setIsAnswerLocked(true);
      setTimeout(() => {
        goToNextScene();
      }, 1000);
    }
  };

  const goToNextScene = async () => {
    isTransitioning.current = true;
    setGameState("loading");

    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < scenes.length) {
      setCurrentSceneIndex(nextIndex);
      setSelectedAnswers({});
      setIsAnswerLocked(false);
      await loadScene(scenes[nextIndex].sceneId);
      setGameState("playing");
    } else {
      setGameState("finished");
    }

    setTimeout(() => {
      isTransitioning.current = false;
    }, 200);
  };

  // Data derived from the current scene state
  const backgroundAsset = currentSceneData?.assets.find(
    (asset) => asset.type === "background"
  );
  const backgroundUrl = backgroundAsset?.filePath || "";
  const spriteAssets =
    currentSceneData?.assets.filter((asset) => asset.type === "sprite") || [];
  const dialogue = currentSceneData?.dialogues?.[0];
  const question = currentSceneData?.question;

  // Dynamically render sprites based on backend data
  const renderSprites = () => {
    return spriteAssets.map((asset) => {
      // Check if this asset has animation metadata
      const hasAnimation =
        asset.metadata?.animation === "move" &&
        asset.metadata?.endX !== undefined &&
        asset.metadata?.endY !== undefined &&
        asset.metadata?.duration !== undefined;

      if (hasAnimation) {
        return (
          <AnimatedSprite
            key={asset.assetId}
            asset={asset}
            onAnimationComplete={(assetId) => {
              console.log(`Animation completed for asset: ${assetId}`);
            }}
          />
        );
      }

      // Static sprite rendering for assets without animation
      const normalizedX = ((asset.positionX ?? 0) + 10) / 20;
      const normalizedY = ((asset.positionY ?? 0) + 10) / 20;

      return (
        <img
          key={asset.assetId}
          src={asset.filePath}
          alt={asset.name}
          className="absolute h-3/4 max-h-[80%] object-contain"
          style={{
            left: `${Math.max(0, Math.min(100, normalizedX * 100))}%`,
            bottom: `${Math.max(0, Math.min(100, normalizedY * 100))}%`,
            transform: "translateX(-50%)",
            zIndex: asset.orderIndex || 1,
          }}
        />
      );
    });
  };

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <p className="text-white font-pressStart">Loading...</p>
          </div>
        );
      case "error":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-bmRed z-20">
            <p className="text-white font-pressStart">{error}</p>
          </div>
        );
      case "intro":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <h1 className="text-white text-4xl font-pressStart animate-pulse">
              Press to Start
            </h1>
          </div>
        );
      case "finished":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <h1 className="text-white text-4xl font-pressStart">
              Story Completed!
            </h1>
          </div>
        );
      case "playing":
        return (
          dialogue && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-10">
              <p className="text-bmYellow mb-2">{dialogue.characterName}</p>
              <p className="text-white">{dialogue.lineText}</p>
            </div>
          )
        );
      case "question":
        return (
          question && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-10">
              <p className="text-white text-center mb-4">
                {question.promptText}
              </p>
              <div className="grid grid-cols-2 gap-3 mx-4">
                {question.choices.map((choice) => {
                  const status = selectedAnswers[choice.choiceId];
                  const isCorrect = status === "correct";
                  return (
                    <button
                      key={choice.choiceId}
                      onClick={() => handleAnswerSelection(choice)}
                      disabled={isAnswerLocked}
                      className={`p-3 w-full text-white font-pressStart rounded-md border-2 transition-colors text-center ${
                        isCorrect ? "bg-bmGreen border-white" : ""
                      } ${
                        status === "incorrect" ? "bg-bmRed border-gray-500" : ""
                      } ${
                        !status
                          ? "bg-gray-700 hover:bg-gray-600 border-bmYellow"
                          : ""
                      } ${isAnswerLocked ? "pointer-events-none" : ""}`}>
                      {choice.choiceText}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        );
      default:
        return null;
    }
  };

  return (
    <main
      onClick={handleInteraction}
      className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative cursor-pointer select-none">
      <BubbleMenu />
      <div className="aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : "",
          }}></div>
        {(gameState === "playing" || gameState === "question") &&
          renderSprites()}
        {renderGameState()}
      </div>
    </main>
  );
}
