import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";
import AnimatedSprite from "@/components/ui/AnimatedSprite";
import DelayedSprite from "@/components/ui/DelayedSprite";
import DisappearingSprite from "@/components/ui/DisappearingSprite";
import VisionTransition from "@/components/ui/VisionTransition";

export default function GamePage() {
  const { storyId } = useParams();

  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, question, finished, progress-check
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentSceneData, setCurrentSceneData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [error, setError] = useState("");
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeOffset, setShakeOffset] = useState(0);
  const [storyScore, setStoryScore] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0); // Keep for backward compatibility
  const [questionMistakes, setQuestionMistakes] = useState({}); // Track mistakes per question
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);
  const [existingProgress, setExistingProgress] = useState(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showBackgroundOverlay, setShowBackgroundOverlay] = useState(false);
  const backgroundOverlayCountRef = useRef(0);

  // --- NEW STATE FOR SEQUENCE QUESTIONS ---
  // Tracks the next expected orderIndex for sequence-based questions.
  const [sequenceProgress, setSequenceProgress] = useState(1);

  const isTransitioning = useRef(false);

  // Handle background overlay control from sprites
  const handleBackgroundOverlay = (show) => {
    if (show) {
      backgroundOverlayCountRef.current += 1;
    } else {
      backgroundOverlayCountRef.current = Math.max(
        0,
        backgroundOverlayCountRef.current - 1
      );
    }

    const shouldShow = backgroundOverlayCountRef.current > 0;
    setShowBackgroundOverlay(shouldShow);
  };

  // Check for existing progress
  const checkExistingProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) {
        return null;
      }

      const response = await api.get(
        `/game/progress/check/${user.userId}/${storyId}`
      );

      if (response.data.hasExistingProgress) {
        setExistingProgress(response.data);
        setShowProgressDialog(true);
        setGameState("progress-check");
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error checking progress:", error);
      return null;
    }
  };

  // Handle continue game
  const handleContinueGame = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      const response = await api.post(
        `/game/continue/${user.userId}/${storyId}`
      );

      if (response.data.hasExistingProgress) {
        const progress = response.data;
        const sceneIndex = scenes.findIndex(
          (scene) =>
            scene.sceneId === progress.currentSceneId ||
            scene.sceneOrder === progress.currentSceneId
        );

        if (sceneIndex !== -1) {
          setCurrentSceneIndex(sceneIndex);
          await loadScene(progress.currentSceneId);

          if (progress.answerStates) {
            setSelectedAnswers(progress.answerStates);
            const hasCorrectAnswer = Object.values(
              progress.answerStates
            ).includes("correct");
            if (hasCorrectAnswer) {
              setIsAnswerLocked(true);
            } else {
              setIsAnswerLocked(false);
            }
          } else if (progress.perQuestionState) {
            setSelectedAnswers(progress.perQuestionState);
            const hasCorrectAnswer = Object.values(
              progress.perQuestionState
            ).includes("correct");
            if (hasCorrectAnswer) {
              setIsAnswerLocked(true);
            } else {
              setIsAnswerLocked(false);
            }
          }

          if (progress.mistakeCount !== undefined) {
            setMistakeCount(progress.mistakeCount);
          }
          if (progress.questionMistakes) {
            setQuestionMistakes(progress.questionMistakes);
          }
          if (!gameStartTime) {
            setGameStartTime(new Date());
          }
          setGameState("playing");
        } else {
          const firstSceneId = scenes[0].sceneId || scenes[0].sceneOrder;
          await loadScene(firstSceneId);
          setCurrentSceneIndex(0);
          setGameStartTime(new Date());
          setGameState("playing");
        }
      }
      setShowProgressDialog(false);
    } catch (error) {
      console.error("Error continuing game:", error);
      setShowProgressDialog(false);
    }
  };

  // Handle restart game
  const handleRestartGame = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      await api.post(`/game/restart/${user.userId}/${storyId}`);

      setCurrentSceneIndex(0);
      setMistakeCount(0);
      setQuestionMistakes({});
      setSelectedAnswers({});
      setIsAnswerLocked(false);
      setGameStartTime(new Date());
      const firstSceneId = scenes[0].sceneId || scenes[0].sceneOrder;
      await loadScene(firstSceneId);
      setGameState("intro");
      setShowProgressDialog(false);
    } catch (error) {
      console.error("Error restarting game:", error);
      setShowProgressDialog(false);
    }
  };

  // Count total questions in the story
  const countTotalQuestions = async (scenes) => {
    let questionCount = 0;
    for (const scene of scenes) {
      if (scene.question) { // Check if question exists in the scene summary
        questionCount++;
      }
    }
    setTotalQuestions(questionCount);
  };

  // Fetch the story's scene list when the component mounts
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setGameState("loading");
        const storyResponse = await api.get(`/stories/${storyId}`);
        const storyData = storyResponse.data;

        if (!storyData || !storyData.scenes || storyData.scenes.length === 0) {
          throw new Error("No scenes found for this story.");
        }
        
        // Sort scenes by sceneOrder
        const sortedScenes = storyData.scenes.sort((a, b) => a.sceneOrder - b.sceneOrder);
        setScenes(sortedScenes);
        
        // Count questions from the full story data
        let questionCount = sortedScenes.filter(scene => scene.question).length;
        setTotalQuestions(questionCount);
        
        const progress = await checkExistingProgress();
        if (!progress) {
          setCurrentSceneData(sortedScenes[0]);
          setGameState("intro");
        }
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
        // Find scene data from the already fetched story data
        const sceneData = scenes.find(s => s.sceneId === sceneId || s.sceneOrder === sceneId);
        if (sceneData) {
            setCurrentSceneData(sceneData);
            backgroundOverlayCountRef.current = 0;
            setShowBackgroundOverlay(false);
        } else {
            throw new Error(`Scene with ID ${sceneId} not found in story data.`);
        }
    } catch (err) {
      handleError("A problem occurred while loading the scene.", err);
    }
  };

  // Check for metadata-based effects when scene data changes
  useEffect(() => {
    if (currentSceneData) {
      checkSceneEffects();
    }
  }, [currentSceneData]);

  // Handle user clicks to advance the story
  const handleInteraction = async () => {
    if (
      isTransitioning.current ||
      ["question", "loading", "progress-check"].includes(gameState)
    ) {
      return;
    }

    if (currentSceneData?.assets) {
      currentSceneData.assets.forEach((asset) => {
        if (asset.metadata?.screenShakeOnClick) {
          const shakeConfig = asset.metadata.screenShakeOnClick;
          triggerScreenShake(shakeConfig.duration || 500, shakeConfig.intensity || 5);
        }
      });
    }

    if (gameState === "intro") {
      setGameState("playing");
      setGameStartTime(new Date()); 
      if (scenes.length > 0) {
        const firstSceneId = scenes[0].sceneId || scenes[0].sceneOrder;
        await saveSceneProgress(firstSceneId);
      }
      return;
    }

    if (gameState === "finished" && !showScore) {
      handleScoreDisplay();
      return;
    }

    if (currentSceneData?.question) {
      // If the question is a sequence type, reset the progress tracker.
      if (currentSceneData.question.type === "Sequence") {
        setSequenceProgress(1); // Reset to look for the first item
      }
      setGameState("question");
    } else {
      goToNextScene();
    }
  };

  const trackUserResponse = async (questionId, choiceId, isCorrect) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;
      const responseData = { givenAnswer: choiceId.toString(), isCorrect: isCorrect };
      await api.post(`/user-responses/user/${user.userId}/question/${questionId}`, responseData);
    } catch (error) {
      console.error("Failed to track user response:", error);
    }
  };

  const saveSceneProgress = async (sceneId, pointsEarned = 0) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;
      const progressData = {
        userId: user.userId,
        storyId: parseInt(storyId),
        sceneId: sceneId,
        pointsEarned: pointsEarned,
        gameStartTime: gameStartTime ? gameStartTime.toISOString() : null,
        mistakeCount: mistakeCount,
        answerStates: selectedAnswers,
        perQuestionState: selectedAnswers,
        questionMistakes: questionMistakes,
      };
      await api.post("/game/save-scene-progress", progressData);
    } catch (error) {
      console.error("Failed to save scene progress:", error);
    }
  };

  const saveWrongAnswerStateWithData = async (sceneId, answerStates, updatedQuestionMistakes, updatedMistakeCount) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;
      const progressData = {
        userId: user.userId,
        storyId: parseInt(storyId),
        sceneId: sceneId,
        pointsEarned: 0,
        gameStartTime: gameStartTime ? gameStartTime.toISOString() : null,
        mistakeCount: updatedMistakeCount !== null ? updatedMistakeCount : mistakeCount,
        answerStates: answerStates,
        perQuestionState: answerStates,
        questionMistakes: updatedQuestionMistakes || questionMistakes,
      };
      await api.post("/game/save-wrong-answer", progressData);
    } catch (error) {
      console.error("Failed to save wrong answer state with data:", error);
    }
  };

  const saveGameAttempt = async (score) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      let startTime = gameStartTime || new Date();
      const endTime = new Date();
      const attemptData = new URLSearchParams({
        userId: user.userId.toString(),
        storyId: storyId.toString(),
        score: score.earnedPoints.toString(),
        totalPossibleScore: score.totalPossiblePoints.toString(),
        startAttemptDate: startTime.toISOString(),
        endAttemptDate: endTime.toISOString(),
      });
      await api.post("/game-attempts", attemptData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    } catch (error) {
      console.error("Failed to save game attempt:", error);
    }
  };

  const fetchMatchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;
      const response = await api.get(`/game-attempts/test/user/${user.userId}`);
      setMatchHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch match history:", error);
    }
  };

  const triggerScreenShake = (duration = 500, intensity = 5) => {
    setIsShaking(true);
    setShakeOffset(0);
    const shakeInterval = setInterval(() => {
      setShakeOffset((prev) => (prev === intensity ? -intensity : intensity));
    }, 50);
    setTimeout(() => {
      clearInterval(shakeInterval);
      setIsShaking(false);
      setTimeout(() => setShakeOffset(0), 10);
    }, duration);
  };

  const checkSceneEffects = () => {
    if (!currentSceneData?.assets) return;
    currentSceneData.assets.forEach((asset) => {
      if (asset.metadata?.screenShake) {
        const { delay = 0, duration = 500, intensity = 5 } = asset.metadata.screenShake;
        setTimeout(() => triggerScreenShake(duration, intensity), delay);
      }
    });
  };

  const handleAnswerSelection = async (choice) => {
    if (isAnswerLocked || selectedAnswers[choice.choiceId]) return;

    const questionId = currentSceneData?.question?.questionId;
    setSelectedAnswers((prev) => ({ ...prev, [choice.choiceId]: choice.isCorrect ? "correct" : "incorrect" }));

    if (questionId) await trackUserResponse(questionId, choice.choiceId, choice.isCorrect);

    if (choice.isCorrect) {
      setIsAnswerLocked(true);
      setShowCorrectFeedback(true);
      const currentMistakes = questionMistakes[questionId] || 0;
      const pointsPerQuestion = currentSceneData?.question?.points || 4;
      const pointsEarned = Math.max(0, pointsPerQuestion - currentMistakes);
      const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
      await saveSceneProgress(currentSceneId, pointsEarned);
      const nextIndex = currentSceneIndex + 1;
      if (nextIndex < scenes.length) {
        const nextSceneId = scenes[nextIndex].sceneId || scenes[nextIndex].sceneOrder;
        await saveSceneProgress(nextSceneId, 0);
      }
      setTimeout(() => {
        setShowCorrectFeedback(false);
        goToNextScene(true);
      }, 2000);
    } else {
      let updatedQuestionMistakes = { ...questionMistakes };
      if (questionId) {
        updatedQuestionMistakes[questionId] = (updatedQuestionMistakes[questionId] || 0) + 1;
        setQuestionMistakes(updatedQuestionMistakes);
      }
      const newGlobalMistakeCount = mistakeCount + 1;
      setMistakeCount(newGlobalMistakeCount);
      const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
      const updatedSelectedAnswers = { ...selectedAnswers, [choice.choiceId]: "incorrect" };
      await saveWrongAnswerStateWithData(currentSceneId, updatedSelectedAnswers, updatedQuestionMistakes, newGlobalMistakeCount);
      triggerScreenShake(500, 5);
    }
  };

  const handleSequenceSelection = async (choice) => {
    if (isAnswerLocked) return;

    const question = currentSceneData?.question;
    const questionId = question?.questionId;

    if (choice.orderIndex === sequenceProgress) {
      setSelectedAnswers((prev) => ({ ...prev, [choice.choiceText]: "correct" }));
      const newProgress = sequenceProgress + 1;
      setSequenceProgress(newProgress);

      if (newProgress > question.choices.length) {
        setIsAnswerLocked(true);
        setShowCorrectFeedback(true);
        const currentMistakes = questionMistakes[questionId] || 0;
        const pointsPerQuestion = question?.points || 5;
        const pointsEarned = Math.max(0, pointsPerQuestion - currentMistakes);
        const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
        await saveSceneProgress(currentSceneId, pointsEarned);
        const nextIndex = currentSceneIndex + 1;
        if (nextIndex < scenes.length) {
          const nextSceneId = scenes[nextIndex].sceneId || scenes[nextIndex].sceneOrder;
          await saveSceneProgress(nextSceneId, 0);
        }
        setTimeout(() => {
          setShowCorrectFeedback(false);
          goToNextScene(true);
        }, 2000);
      }
    } else {
      setSelectedAnswers((prev) => ({ ...prev, [choice.choiceText]: "incorrect" }));
      let updatedQuestionMistakes = { ...questionMistakes };
      if (questionId) {
        updatedQuestionMistakes[questionId] = (updatedQuestionMistakes[questionId] || 0) + 1;
        setQuestionMistakes(updatedQuestionMistakes);
      }
      const newGlobalMistakeCount = mistakeCount + 1;
      setMistakeCount(newGlobalMistakeCount);
      const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
      const updatedSelectedAnswers = { ...selectedAnswers, [choice.choiceText]: "incorrect" };
      await saveWrongAnswerStateWithData(currentSceneId, updatedSelectedAnswers, updatedQuestionMistakes, newGlobalMistakeCount);
      triggerScreenShake(500, 5);
      setTimeout(() => {
        setSelectedAnswers((prev) => {
          const newState = { ...prev };
          delete newState[choice.choiceText];
          return newState;
        });
      }, 1000);
    }
  };

  const calculateStoryScore = async () => {
    const pointsPerQuestionMCQ = 4;
    const pointsPerQuestionSeq = 5;
    let totalPossiblePoints = 0;
    let earnedPoints = 0;
    let totalWrongAttempts = 0;

    scenes.forEach(scene => {
        if (scene.question) {
            const qId = scene.question.questionId;
            const mistakesForQuestion = questionMistakes[qId] || 0;
            totalWrongAttempts += mistakesForQuestion;

            if (scene.question.type === 'Sequence') {
                totalPossiblePoints += pointsPerQuestionSeq;
                earnedPoints += Math.max(0, pointsPerQuestionSeq - mistakesForQuestion);
            } else { // Default to MCQ
                totalPossiblePoints += pointsPerQuestionMCQ;
                earnedPoints += Math.max(0, pointsPerQuestionMCQ - mistakesForQuestion);
            }
        }
    });

    const percentage = totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 10000) / 100 : 0;
    const score = {
      storyId: parseInt(storyId),
      storyTitle: "Story",
      totalQuestions: totalQuestions,
      totalPossiblePoints: totalPossiblePoints,
      earnedPoints: earnedPoints,
      percentage: percentage,
      wrongAttempts: totalWrongAttempts,
    };
    setStoryScore(score);
    await saveGameAttempt(score);
  };

  const handleScoreDisplay = () => {
    setShowScore(true);
  };

  const goToNextScene = async (skipProgressSave = false) => {
    isTransitioning.current = true;
    setGameState("loading");
    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < scenes.length) {
      if (!skipProgressSave) {
        const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
        await saveSceneProgress(currentSceneId);
      }
      setCurrentSceneIndex(nextIndex);
      setCurrentSceneData(scenes[nextIndex]);
      setSelectedAnswers({});
      setIsAnswerLocked(false);
      setShowCorrectFeedback(false);
      setIsShaking(false);
      setShakeOffset(0);
      setGameState("playing");
      setTimeout(() => { isTransitioning.current = false; }, 200);
    } else {
      const currentSceneId = scenes[currentSceneIndex].sceneId || scenes[currentSceneIndex].sceneOrder;
      await saveSceneProgress(currentSceneId);
      setGameState("finished");
      await calculateStoryScore();
      setTimeout(() => { handleScoreDisplay(); }, 3000);
    }
  };

  const backgroundAssets = currentSceneData?.assets?.filter((asset) => asset.type === "background") || [];
  const spriteAssets = currentSceneData?.assets?.filter((asset) => asset.type === "sprite") || [];
  const dialogue = currentSceneData?.dialogues?.[0];
  const question = currentSceneData?.question;
  const hasVisionTransition = backgroundAssets.length > 1;

  const renderSprites = () => {
    return spriteAssets.map((asset) => {
      const hasAnimation = asset.metadata?.animation === "move";
      const hasDelayedAppearance = asset.metadata?.appearAfter !== undefined;
      const hasDisappearAfter = asset.metadata?.disappearAfter !== undefined;

      if (hasAnimation || (hasDelayedAppearance && hasDisappearAfter)) {
        return <AnimatedSprite key={`${asset.assetId}-${currentSceneIndex}`} asset={asset} gameState={gameState} onBackgroundOverlay={handleBackgroundOverlay} />;
      }
      if (hasDelayedAppearance) {
        return <DelayedSprite key={`${asset.assetId}-${currentSceneIndex}`} asset={asset} onBackgroundOverlay={handleBackgroundOverlay} />;
      }
      if (hasDisappearAfter) {
        return <DisappearingSprite key={`${asset.assetId}-${currentSceneIndex}`} asset={asset} onBackgroundOverlay={handleBackgroundOverlay} />;
      }
      
      const normalizedX = ((asset.positionX ?? 0) + 10) / 20;
      const normalizedY = ((asset.positionY ?? 0) + 10) / 20;
      const shouldFaceLeft = asset.metadata?.facing === "left";
      const scale = asset.metadata?.scale || 1;
      const transforms = [];
      if (scale !== 1) transforms.push(`scale(${scale})`);
      transforms.push("translateX(-50%)");
      if (shouldFaceLeft) transforms.push("scaleX(-1)");
      const transformStyle = transforms.join(" ");

      return (
        <img
          key={`${asset.assetId}-${currentSceneIndex}`}
          src={asset.filePath}
          alt={asset.name}
          className="absolute h-3/4 max-h-[80%] object-contain"
          style={{
            left: `${Math.max(0, Math.min(100, normalizedX * 100))}%`,
            bottom: `${Math.max(0, Math.min(100, normalizedY * 100))}%`,
            transform: transformStyle,
            transformOrigin: "center center",
            zIndex: (asset.orderIndex || 1) + 20,
          }}
        />
      );
    });
  };

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20"><p className="text-white font-pressStart">Loading...</p></div>;
      case "error":
        return <div className="absolute inset-0 flex items-center justify-center bg-bmRed z-20"><p className="text-white font-pressStart">{error}</p></div>;
      case "progress-check":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="bg-gray-800 border-2 border-bmYellow rounded-xl p-8 max-w-md mx-4">
              <h2 className="text-2xl font-pressStart text-bmYellow mb-4 text-center">Continue Your Adventure?</h2>
              {existingProgress && (
                <div className="mb-6">
                  <p className="text-white font-pressStart mb-3">You have existing progress:</p>
                  <div className="bg-gray-700 border border-bmGreen rounded-lg p-4 mb-4">
                    <div className="text-bmGreen font-pressStart text-lg">Scene {existingProgress.currentSceneOrder || "Unknown"}</div>
                    <div className="text-white font-pressStart text-sm">Score: {existingProgress.score || 0} points</div>
                    <div className="text-gray-300 font-pressStart text-xs">Last played: {existingProgress.lastAccessed ? new Date(existingProgress.lastAccessed).toLocaleString() : "Unknown"}</div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={handleContinueGame} className="flex-1 bg-bmGreen text-black px-4 py-3 rounded font-pressStart hover:bg-green-400 transition-colors">Continue</button>
                <button onClick={handleRestartGame} className="flex-1 bg-bmRed text-white px-4 py-3 rounded font-pressStart hover:bg-red-600 transition-colors">Start Over</button>
              </div>
            </div>
          </div>
        );
      case "intro":
        return <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"><h1 className="text-white text-4xl font-pressStart animate-pulse">Press to Start</h1></div>;
      case "finished":
        if (showScore && storyScore) {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <div className="text-center text-white">
                <h1 className="text-4xl font-pressStart mb-8">Story Completed!</h1>
                <div className="bg-bmGreen/20 border-2 border-bmYellow/50 rounded-xl p-8 max-w-md">
                  <h2 className="text-2xl font-pressStart mb-4 text-bmYellow">Your Score</h2>
                  <div className="text-6xl font-pressStart mb-4 text-bmGreen">{storyScore.percentage}%</div>
                  <div className="text-lg font-pressStart mb-2">{storyScore.earnedPoints} / {storyScore.totalPossiblePoints} points</div>
                  <div className="text-sm font-pressStart text-gray-300">{storyScore.totalQuestions} questions • {storyScore.wrongAttempts} wrong attempts</div>
                  <button onClick={() => { setShowMatchHistory(true); fetchMatchHistory(); }} className="mt-4 bg-bmYellow text-black px-4 py-2 rounded font-pressStart hover:bg-yellow-400 transition-colors">View Match History</button>
                </div>
              </div>
            </div>
          );
        } else {
          return <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20"><h1 className="text-white text-4xl font-pressStart mb-4">Story Completed!</h1></div>;
        }
      case "playing":
        return dialogue && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
            <p className="text-bmYellow mb-2">{dialogue.characterName}</p>
            <p className="text-white">{dialogue.lineText}</p>
          </div>
        );
      case "question":
        if (!question) return null;
        if (question.type === "Sequence") {
            // Sort choices by their text for consistent display order
            const displayChoices = [...question.choices].sort((a, b) => a.choiceText.localeCompare(b.choiceText));
            return (
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
                <p className="text-white text-center mb-4">{question.promptText}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mx-4">
                  {displayChoices.map((choice, index) => {
                    const status = selectedAnswers[choice.choiceText];
                    const isCorrectlySelected = status === "correct";
                    return (
                      <button
                        key={index}
                        onClick={() => handleSequenceSelection(choice)}
                        disabled={isAnswerLocked || isCorrectlySelected}
                        className={`p-3 w-full text-white font-pressStart rounded-md border-2 transition-colors text-center text-sm ${
                          isCorrectlySelected ? "bg-bmGreen border-white" : ""
                        } ${
                          status === "incorrect" ? "bg-bmRed border-gray-500 animate-shake" : ""
                        } ${
                          !status ? "bg-gray-700 hover:bg-gray-600 border-bmYellow" : ""
                        } ${
                          isAnswerLocked || isCorrectlySelected ? "pointer-events-none cursor-default" : "cursor-pointer"
                        }`}>
                        {choice.choiceText}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
        if (question.type === "MCQ") {
          return (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
              <p className="text-white text-center mb-4">{question.promptText}</p>
              <div className="grid grid-cols-2 gap-3 mx-4">
                {question.choices.map((choice) => {
                  const status = selectedAnswers[choice.choiceId];
                  const isCorrect = status === "correct";
                  return (
                    <button
                      key={choice.choiceId}
                      onClick={() => handleAnswerSelection(choice)}
                      disabled={isAnswerLocked || status}
                      className={`p-3 w-full text-white font-pressStart rounded-md border-2 transition-colors text-center ${
                        isCorrect ? "bg-bmGreen border-white" : ""
                      } ${
                        status === "incorrect" ? "bg-bmRed border-gray-500" : ""
                      } ${
                        !status ? "bg-gray-700 hover:bg-gray-600 border-bmYellow" : ""
                      } ${
                        isAnswerLocked || status ? "pointer-events-none cursor-default" : "cursor-pointer"
                      }`}>
                      {choice.choiceText}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative select-none">
      <BubbleMenu />
      <div
        onClick={handleInteraction}
        className={`aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600 transition-transform duration-75 cursor-pointer ${isShaking ? "animate-shake" : ""}`}
        style={{ transform: `translateX(${shakeOffset}px)`, transition: "transform 0.05s ease-in-out" }}>
        {hasVisionTransition ? (
          <VisionTransition backgrounds={backgroundAssets} gameState={gameState} />
        ) : (
          <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: backgroundAssets[0]?.filePath ? `url('${backgroundAssets[0].filePath}')` : "" }} />
        )}
        {showBackgroundOverlay && <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>}
        {gameState !== "loading" && renderSprites()}
        {showCorrectFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-[100]">
            <div className="bg-bmGreen text-white text-6xl font-pressStart px-8 py-4 rounded-xl border-4 border-white shadow-2xl animate-bounce">CORRECT!</div>
          </div>
        )}
        {renderGameState()}
      </div>

      {showMatchHistory && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-[200]">
          <div className="bg-gray-800 border-2 border-bmYellow rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pressStart text-bmYellow">Match History</h2>
              <button onClick={() => setShowMatchHistory(false)} className="text-white hover:text-bmRed font-pressStart text-xl">✕</button>
            </div>
            {matchHistory.length === 0 ? (
              <p className="text-white font-pressStart text-center py-8">No attempts recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {matchHistory.map((attempt, index) => (
                  <div key={attempt.attemptId || index} className="bg-gray-700 border border-bmGreen rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-pressStart text-bmYellow">{attempt.storyTitle || `Story ${attempt.storyId}`}</h3>
                        <p className="text-white font-pressStart text-sm">{new Date(attempt.endAttemptDate).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-pressStart text-bmGreen">{attempt.percentage?.toFixed(1)}%</div>
                        <div className="text-sm font-pressStart text-gray-300">{attempt.score} / {attempt.totalPossibleScore} pts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}