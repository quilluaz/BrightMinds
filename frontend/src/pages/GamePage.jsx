import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";

export default function GamePage() {
  const { storyId } = useParams(); // Get storyId from the URL

  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, question, finished
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [dialogues, setDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [sprites, setSprites] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [error, setError] = useState("");

  const isTransitioning = useRef(false);

  // Fetch story data when the component mounts or storyId changes
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

  // Simplified loadScene function using the new endpoint
  const loadScene = async (sceneId) => {
    if (!sceneId) return;
    try {
      const { data: gameScene } = await api.get(`/game/scene/${sceneId}`);

      const backgroundAsset = gameScene.assets.find(
        (asset) => asset.type === "background"
      );
      setBackgroundUrl(backgroundAsset ? backgroundAsset.filePath : "");

      const spriteAssets = gameScene.assets.filter(
        (asset) => asset.type === "sprite"
      );
      setSprites(spriteAssets);

      setDialogues(gameScene.dialogues);
      setQuestion(gameScene.question);
    } catch (err) {
      handleError("A problem occurred while loading the scene.", err);
    }
  };

  const handleInteraction = async () => {
    if (
      isTransitioning.current ||
      gameState === "question" ||
      gameState === "finished"
    )
      return;

    if (gameState === "intro") {
      setGameState("playing");
      return;
    }

    if (gameState !== "playing") return;

    const nextDialogueIndex = currentDialogueIndex + 1;
    if (nextDialogueIndex < dialogues.length) {
      setCurrentDialogueIndex(nextDialogueIndex);
    } else {
      if (question) {
        setGameState("question");
      } else {
        goToNextScene();
      }
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
      isTransitioning.current = true;
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
      setCurrentDialogueIndex(0);
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

  const getSprite = (name) => sprites.find((s) => s.name === name);

  const renderSprites = () => {
    // This function can remain the same as in Game1.jsx for now
    // Or be updated to be more dynamic based on asset metadata
    const liamIdle = getSprite("liam_idle");
    const litaThinking = getSprite("lita_thinking");

    return (
      <>
        {liamIdle && (
          <img
            src={liamIdle.filePath}
            alt="Liam"
            className="absolute bottom-0 left-4 h-3/4"
          />
        )}
        {litaThinking && (
          <img
            src={litaThinking.filePath}
            alt="Elder Lita"
            className="absolute bottom-0 right-4 h-3/4"
          />
        )}
      </>
    );
  };

  const renderGameState = () => {
    // This function remains the same as in Game1.jsx
    switch (gameState) {
      case "loading":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-white font-pressStart">Loading...</p>
          </div>
        );
      case "error":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-bmRed">
            <p className="text-white font-pressStart">{error}</p>
          </div>
        );
      case "intro":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <h1 className="text-white text-4xl font-pressStart animate-pulse">
              Press to Start
            </h1>
          </div>
        );
      case "finished":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <h1 className="text-white text-4xl font-pressStart">
              Story Completed!
            </h1>
          </div>
        );
      case "playing":
        return (
          dialogues.length > 0 &&
          currentDialogueIndex < dialogues.length && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg">
              <p className="text-bmYellow mb-2">
                {dialogues[currentDialogueIndex].characterName}
              </p>
              <p className="text-white">
                {dialogues[currentDialogueIndex].lineText}
              </p>
            </div>
          )
        );
      case "question":
        return (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg">
            <p className="text-white text-center mb-4">{question.promptText}</p>
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
