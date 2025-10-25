import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";
import AnimatedSprite from "@/components/ui/AnimatedSprite";
import DelayedSprite from "@/components/ui/DelayedSprite";
import DisappearingSprite from "@/components/ui/DisappearingSprite";
import VisionTransition from "@/components/ui/VisionTransition";

export default function GamePageMCQ() {
  const { storyId } = useParams();
  const navigate = useNavigate();

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
    console.log(
      `Background overlay: ${show ? "requested" : "released"}, count: ${
        backgroundOverlayCountRef.current
      }, showing: ${shouldShow}`
    );

    // Show overlay if any sprites are requesting it, hide if none are
    setShowBackgroundOverlay(shouldShow);
  };

  // Check for existing progress
  const checkExistingProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) {
        console.log("No user found, starting fresh");
        return null;
      }

      const response = await api.get(
        `/game/progress/check/${user.userId}/${storyId}`
      );
      console.log("Progress check response:", response.data);

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
      console.log("Continue game response:", response.data);

      if (response.data.hasExistingProgress) {
        // Load the scene where user left off (next available scene)
        const progress = response.data;
        const sceneIndex = scenes.findIndex(
          (scene) =>
            scene.sceneId === progress.currentSceneId ||
            scene.sceneOrder === progress.currentSceneId
        );

        if (sceneIndex !== -1) {
          setCurrentSceneIndex(sceneIndex);
          await loadScene(progress.currentSceneId);

          // Restore the existing progress state
          if (progress.answerStates) {
            setSelectedAnswers(progress.answerStates);

            // Only lock if there's a correct answer selected
            const hasCorrectAnswer = Object.values(
              progress.answerStates
            ).includes("correct");
            if (hasCorrectAnswer) {
              setIsAnswerLocked(true);
              console.log(
                "Restored answer lock state - correct answer already selected"
              );
            } else {
              setIsAnswerLocked(false);
              console.log(
                "Restored answer state - wrong answers selected, allowing more attempts"
              );
            }
          } else if (progress.perQuestionState) {
            // Fallback to perQuestionState if answerStates is not available
            setSelectedAnswers(progress.perQuestionState);

            const hasCorrectAnswer = Object.values(
              progress.perQuestionState
            ).includes("correct");
            if (hasCorrectAnswer) {
              setIsAnswerLocked(true);
              console.log(
                "Restored answer lock state from perQuestionState - correct answer already selected"
              );
            } else {
              setIsAnswerLocked(false);
              console.log(
                "Restored answer state from perQuestionState - wrong answers selected, allowing more attempts"
              );
            }
          }

          // Restore mistake count from progress
          if (progress.mistakeCount !== undefined) {
            setMistakeCount(progress.mistakeCount);
          }

          // Restore per-question mistake tracking from progress
          if (progress.questionMistakes) {
            setQuestionMistakes(progress.questionMistakes);
            console.log(
              "Restored per-question mistakes:",
              progress.questionMistakes
            );
          }

          // Set game start time for continued games (use current time as fallback)
          if (!gameStartTime) {
            setGameStartTime(new Date());
          }

          setGameState("playing");
        } else {
          // If scene not found, start from beginning
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

      const response = await api.post(
        `/game/restart/${user.userId}/${storyId}`
      );
      console.log("Restart game response:", response.data);

      // Start fresh from the beginning
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
      try {
        const { data: gameScene } = await api.get(
          `/game/scene/${scene.sceneId}`
        );
        console.log(`Scene ${scene.sceneId} data:`, gameScene);
        if (gameScene.question) {
          questionCount++;
          console.log(`Found question in scene ${scene.sceneId}`);
        }
      } catch (err) {
        console.error(
          "Error counting questions for scene:",
          scene.sceneId,
          err
        );
      }
    }

    // Fallback: if no questions found via API, use hardcoded count for story 1
    if (questionCount === 0 && storyId === "1") {
      questionCount = 9; // Story 1 has 9 questions based on the data provided
      console.log("Using fallback count for story 1:", questionCount);
    }

    setTotalQuestions(questionCount);
    console.log("Total questions in story:", questionCount);
  };

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

        // Count total questions in the story
        await countTotalQuestions(scenesResponse.data);

        // Check for existing progress before starting
        const progress = await checkExistingProgress();

        if (!progress) {
          // No existing progress, start fresh
          const firstSceneId =
            scenesResponse.data[0].sceneId || scenesResponse.data[0].sceneOrder;
          await loadScene(firstSceneId);
          setGameState("intro");
        }
        // If progress exists, the checkExistingProgress function will handle showing the dialog
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

      // Reset background overlay counter when scene changes
      backgroundOverlayCountRef.current = 0;
      setShowBackgroundOverlay(false);
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

    // Check for interaction-based screen shake effects
    if (currentSceneData?.assets) {
      currentSceneData.assets.forEach((asset) => {
        if (asset.metadata?.screenShakeOnClick) {
          const shakeConfig = asset.metadata.screenShakeOnClick;
          const duration = shakeConfig.duration || 500;
          const intensity = shakeConfig.intensity || 5;

          console.log(
            `Triggering click-based screen shake for asset ${asset.name}:`,
            shakeConfig
          );
          triggerScreenShake(duration, intensity);
        }
      });
    }

    if (gameState === "intro") {
      setGameState("playing");
      setGameStartTime(new Date()); // Record when the game actually starts
      // Save progress for the first scene when game starts
      if (scenes.length > 0) {
        const firstSceneId = scenes[0].sceneId || scenes[0].sceneOrder;
        await saveSceneProgress(firstSceneId);
      }
      return;
    }

    if (gameState === "finished" && !showScore) {
      // User clicked during "Story Completed!" - show score immediately
      console.log(
        "User clicked during finished state, showing score immediately"
      );
      handleScoreDisplay();
      return;
    }

    if (currentSceneData?.question) {
      setGameState("question");
    } else {
      goToNextScene();
    }
  };

  const trackUserResponse = async (questionId, choiceId, isCorrect) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      const responseData = {
        givenAnswer: choiceId.toString(),
        isCorrect: isCorrect,
      };

      await api.post(
        `/user-responses/user/${user.userId}/question/${questionId}`,
        responseData
      );
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
      console.log("Scene progress saved:", {
        sceneId,
        pointsEarned,
        selectedAnswers,
      });
    } catch (error) {
      console.error("Failed to save scene progress:", error);
    }
  };

  const saveWrongAnswerState = async (sceneId) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      const progressData = {
        userId: user.userId,
        storyId: parseInt(storyId),
        sceneId: sceneId,
        pointsEarned: 0,
        gameStartTime: gameStartTime ? gameStartTime.toISOString() : null,
        mistakeCount: mistakeCount,
        answerStates: selectedAnswers,
        perQuestionState: selectedAnswers,
        questionMistakes: questionMistakes,
      };

      await api.post("/game/save-wrong-answer", progressData);
      console.log("Wrong answer state saved:", {
        sceneId,
        selectedAnswers,
        mistakeCount,
      });
    } catch (error) {
      console.error("Failed to save wrong answer state:", error);
    }
  };

  const saveWrongAnswerStateWithData = async (
    sceneId,
    answerStates,
    updatedQuestionMistakes = null,
    updatedMistakeCount = null
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      const progressData = {
        userId: user.userId,
        storyId: parseInt(storyId),
        sceneId: sceneId,
        pointsEarned: 0,
        gameStartTime: gameStartTime ? gameStartTime.toISOString() : null,
        mistakeCount:
          updatedMistakeCount !== null ? updatedMistakeCount : mistakeCount,
        answerStates: answerStates,
        perQuestionState: answerStates,
        questionMistakes: updatedQuestionMistakes || questionMistakes,
      };

      await api.post("/game/save-wrong-answer", progressData);
      console.log("Wrong answer state saved with data:", {
        sceneId,
        answerStates,
        mistakeCount: progressData.mistakeCount,
        questionMistakes: progressData.questionMistakes,
      });
    } catch (error) {
      console.error("Failed to save wrong answer state with data:", error);
    }
  };

  const saveGameAttempt = async (score) => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) {
        console.error("No user found in localStorage");
        return;
      }

      let startTime = gameStartTime;
      if (!startTime) {
        console.warn(
          "No game start time found, using current time as fallback"
        );
        startTime = new Date();
        setGameStartTime(startTime);
      }

      const endTime = new Date();
      const startTimeISO = startTime.toISOString();
      const endTimeISO = endTime.toISOString();

      const attemptData = new URLSearchParams({
        userId: user.userId.toString(),
        storyId: storyId.toString(),
        score: score.earnedPoints.toString(),
        totalPossibleScore: score.totalPossiblePoints.toString(),
        startAttemptDate: startTimeISO,
        endAttemptDate: endTimeISO,
      });

      // Debug: Log the actual values being sent
      console.log(
        "Debug - userId type:",
        typeof user.userId,
        "value:",
        user.userId
      );
      console.log("Debug - storyId type:", typeof storyId, "value:", storyId);
      console.log(
        "Debug - score type:",
        typeof score.earnedPoints,
        "value:",
        score.earnedPoints
      );
      console.log(
        "Debug - totalPossibleScore type:",
        typeof score.totalPossiblePoints,
        "value:",
        score.totalPossiblePoints
      );

      console.log("Saving game attempt:", {
        userId: user.userId,
        storyId: storyId,
        score: score.earnedPoints,
        totalPossibleScore: score.totalPossiblePoints,
        startAttemptDate: startTimeISO,
        endAttemptDate: endTimeISO,
      });

      console.log("URLSearchParams data:", attemptData.toString());

      const response = await api.post("/game-attempts", attemptData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Game attempt saved successfully:", response.data);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
    } catch (error) {
      console.error("Failed to save game attempt:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
  };

  const fetchMatchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      const response = await api.get(`/game-attempts/test/user/${user.userId}`);
      setMatchHistory(response.data);
      console.log("Match history fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch match history:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
  };

  // Metadata-based screen shake effect
  const triggerScreenShake = (duration = 500, intensity = 5) => {
    console.log(
      `Triggering screen shake: duration=${duration}ms, intensity=${intensity}px`
    );
    setIsShaking(true);
    setShakeOffset(0);

    // Create shake animation
    const shakeInterval = setInterval(() => {
      setShakeOffset((prev) => (prev === intensity ? -intensity : intensity));
    }, 50);

    setTimeout(() => {
      clearInterval(shakeInterval);
      setIsShaking(false);
      // Ensure we return to center position
      setTimeout(() => {
        setShakeOffset(0);
      }, 10);
    }, duration);
  };

  // Check for metadata-based effects on scene load
  const checkSceneEffects = () => {
    if (!currentSceneData?.assets) return;

    // Check each asset for shake effects
    currentSceneData.assets.forEach((asset) => {
      if (asset.metadata?.screenShake) {
        const shakeConfig = asset.metadata.screenShake;
        const delay = shakeConfig.delay || 0;
        const duration = shakeConfig.duration || 500;
        const intensity = shakeConfig.intensity || 5;

        console.log(
          `Scheduled screen shake for asset ${asset.name}:`,
          shakeConfig
        );

        setTimeout(() => {
          triggerScreenShake(duration, intensity);
        }, delay);
      }
    });
  };

  const handleAnswerSelection = async (choice) => {
    if (isAnswerLocked) return;

    // Don't allow selecting an answer that has already been selected
    if (selectedAnswers[choice.choiceId]) {
      console.log("Answer already selected:", choice.choiceId);
      return;
    }

    const questionId = currentSceneData?.question?.questionId;

    setSelectedAnswers((prev) => ({
      ...prev,
      [choice.choiceId]: choice.isCorrect ? "correct" : "incorrect",
    }));

    // Track the user response
    if (questionId) {
      await trackUserResponse(questionId, choice.choiceId, choice.isCorrect);
    }

    if (choice.isCorrect) {
      setIsAnswerLocked(true);
      setShowCorrectFeedback(true);

      // Calculate points earned based on mistakes for this specific question
      // Use a more reliable way to get the current mistake count
      const currentMistakes = questionMistakes[questionId] || 0;
      const pointsPerQuestion = currentSceneData?.question?.points || 4;
      const pointsEarned = Math.max(0, pointsPerQuestion - currentMistakes);

      console.log(
        `Correct answer for question ${questionId}! Points calculation:`,
        {
          pointsPerQuestion,
          mistakesForThisQuestion: currentMistakes,
          pointsEarned,
          questionMistakes: questionMistakes,
        }
      );

      // Save progress with points earned for correct answer
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;
      await saveSceneProgress(currentSceneId, pointsEarned);

      // Update progress to next scene immediately to prevent getting stuck on same question
      const nextIndex = currentSceneIndex + 1;
      if (nextIndex < scenes.length) {
        const nextSceneId =
          scenes[nextIndex].sceneId || scenes[nextIndex].sceneOrder;
        await saveSceneProgress(nextSceneId, 0); // Update current scene to next scene
      }

      setTimeout(() => {
        setShowCorrectFeedback(false);
        goToNextScene(true); // Skip progress save since we already updated it
      }, 2000); // Show "CORRECT!" for 2 seconds
    } else {
      // Increment mistake counter for this specific question
      let updatedQuestionMistakes = { ...questionMistakes };
      if (questionId) {
        updatedQuestionMistakes[questionId] =
          (updatedQuestionMistakes[questionId] || 0) + 1;
        setQuestionMistakes(updatedQuestionMistakes);
        console.log(
          `Wrong answer for question ${questionId}! Mistakes for this question:`,
          updatedQuestionMistakes[questionId],
          "Previous mistakes:",
          questionMistakes[questionId] || 0,
          "All question mistakes:",
          updatedQuestionMistakes
        );
      }

      // Also increment global mistake count for backward compatibility
      const newGlobalMistakeCount = mistakeCount + 1;
      setMistakeCount(newGlobalMistakeCount);
      console.log("Wrong answer! Global mistake count:", newGlobalMistakeCount);

      // Save wrong answer state immediately with current state
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;

      // Capture the updated selectedAnswers state
      const updatedSelectedAnswers = {
        ...selectedAnswers,
        [choice.choiceId]: "incorrect",
      };

      // Save immediately with the updated mistake counts
      try {
        await saveWrongAnswerStateWithData(
          currentSceneId,
          updatedSelectedAnswers,
          updatedQuestionMistakes,
          newGlobalMistakeCount
        );
        console.log("Wrong answer state saved to progress");
      } catch (error) {
        console.error("Failed to save wrong answer progress:", error);
      }

      // Show subtle screen shake for wrong answer
      triggerScreenShake(500, 5);
    }
  };

  const calculateStoryScore = async () => {
    console.log("Calculating score with:", {
      totalQuestions,
      questionMistakes,
      mistakeCount,
    });

    // Each question is worth 4 points (as specified in requirements)
    const pointsPerQuestion = 4;
    const totalPossiblePoints = totalQuestions * pointsPerQuestion;

    // Calculate earned points based on per-question mistakes
    let earnedPoints = 0;
    let totalWrongAttempts = 0;

    // For each question, calculate points based on mistakes for that specific question
    for (let i = 1; i <= totalQuestions; i++) {
      const mistakesForQuestion = questionMistakes[i] || 0;
      const questionPoints = Math.max(
        0,
        pointsPerQuestion - mistakesForQuestion
      );
      earnedPoints += questionPoints;
      totalWrongAttempts += mistakesForQuestion;
    }

    // Calculate percentage
    const percentage =
      totalPossiblePoints > 0
        ? Math.round((earnedPoints / totalPossiblePoints) * 10000) / 100
        : 0; // Round to 2 decimal places

    const score = {
      storyId: parseInt(storyId),
      storyTitle: "Story",
      totalQuestions: totalQuestions,
      totalPossiblePoints: totalPossiblePoints,
      earnedPoints: earnedPoints,
      percentage: percentage,
      wrongAttempts: totalWrongAttempts,
    };

    console.log("Calculated score:", score);
    console.log("Per-question mistakes:", questionMistakes);
    setStoryScore(score);

    // Save the game attempt to the backend
    console.log("About to call saveGameAttempt with score:", score);
    try {
      await saveGameAttempt(score);
      console.log("saveGameAttempt completed successfully");
    } catch (error) {
      console.error("Error in saveGameAttempt:", error);
    }
  };

  const handleScoreDisplay = () => {
    console.log("Showing score display, storyScore:", storyScore);
    setShowScore(true);
  };

  const goToNextScene = async (skipProgressSave = false) => {
    isTransitioning.current = true;
    setGameState("loading");

    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < scenes.length) {
      // Save progress for the current scene before moving to next (unless already saved)
      if (!skipProgressSave) {
        const currentSceneId =
          scenes[currentSceneIndex].sceneId ||
          scenes[currentSceneIndex].sceneOrder;
        await saveSceneProgress(currentSceneId);
      }

      setCurrentSceneIndex(nextIndex);
      setSelectedAnswers({});
      setIsAnswerLocked(false);
      setShowCorrectFeedback(false);
      setIsShaking(false);
      setShakeOffset(0);
      // Note: Don't reset questionMistakes here as we want to keep track across all questions
      const nextSceneId =
        scenes[nextIndex].sceneId || scenes[nextIndex].sceneOrder;
      await loadScene(nextSceneId);
      setGameState("playing");

      setTimeout(() => {
        isTransitioning.current = false;
      }, 200);
    } else {
      console.log("Story completed! Setting finished state");
      // Save progress for the last scene
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;
      await saveSceneProgress(currentSceneId);

      setGameState("finished");
      // Calculate the story score using frontend counters and save the attempt
      calculateStoryScore()
        .then(() => {
          console.log("Story score calculated and attempt saved");
        })
        .catch((error) => {
          console.error("Error calculating score or saving attempt:", error);
        });
      // Show score after 3 seconds or when user clicks
      setTimeout(() => {
        console.log("3 seconds passed, showing score");
        handleScoreDisplay();
      }, 3000);
      // Don't reset isTransitioning for finished state
    }
  };

  // Data derived from the current scene state
  const backgroundAssets =
    currentSceneData?.assets.filter((asset) => asset.type === "background") ||
    [];
  const spriteAssets =
    currentSceneData?.assets.filter((asset) => asset.type === "sprite") || [];
  const dialogue = currentSceneData?.dialogues?.[0];
  const question = currentSceneData?.question;

  // Check if this scene has multiple backgrounds (vision transition)
  const hasVisionTransition = backgroundAssets.length > 1;

  // Dynamically render sprites based on backend data
  const renderSprites = () => {
    return spriteAssets.map((asset) => {
      // Debug logging
      console.log(`Asset ${asset.name} metadata:`, asset.metadata);

      // Check if this asset has animation metadata
      const hasAnimation =
        asset.metadata?.animation === "move" &&
        asset.metadata?.endX !== undefined &&
        asset.metadata?.endY !== undefined &&
        asset.metadata?.duration !== undefined;

      // Determine appearance/disappearance behaviors
      const hasDelayedAppearance = asset.metadata?.appearAfter !== undefined;
      const hasDisappearAfter = asset.metadata?.disappearAfter !== undefined;

      // If both appearAfter and disappearAfter are present, use AnimatedSprite
      // because it supports both fade-in and fade-out even without movement
      if (hasAnimation || (hasDelayedAppearance && hasDisappearAfter)) {
        return (
          <AnimatedSprite
            key={`${asset.assetId}-${currentSceneIndex}`}
            asset={asset}
            gameState={gameState}
            onAnimationComplete={(assetId) => {
              console.log(`Animation completed for asset: ${assetId}`);
            }}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      if (hasDelayedAppearance) {
        return (
          <DelayedSprite
            key={`${asset.assetId}-${currentSceneIndex}`}
            asset={asset}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      if (hasDisappearAfter) {
        return (
          <DisappearingSprite
            key={`${asset.assetId}-${currentSceneIndex}`}
            asset={asset}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      // Static sprite rendering for assets without animation, delay, or disappear
      const normalizedX = ((asset.positionX ?? 0) + 10) / 20;
      const normalizedY = ((asset.positionY ?? 0) + 10) / 20;

      // Check if sprite should face left (flip horizontally)
      const shouldFaceLeft = asset.metadata?.facing === "left";

      // Get scale value (default to 1 if not specified)
      const scale = asset.metadata?.scale || 1;

      // Build transform string with proper order
      // Apply scale first, then translation, then horizontal flip
      const transforms = [];

      if (scale !== 1) {
        transforms.push(`scale(${scale})`);
      }

      transforms.push("translateX(-50%)");

      if (shouldFaceLeft) {
        transforms.push("scaleX(-1)");
      }

      const transformStyle = transforms.join(" ");

      // Debug logging
      if (scale !== 1) {
        console.log(
          `Static sprite ${asset.name} scale:`,
          scale,
          "transform:",
          transformStyle,
          "metadata:",
          asset.metadata
        );
      }

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
            zIndex: (asset.orderIndex || 1) + 20, // Ensure sprites appear above question overlay
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
      case "progress-check":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="bg-gray-800 border-2 border-bmYellow rounded-xl p-8 max-w-md mx-4">
              <h2 className="text-2xl font-pressStart text-bmYellow mb-4 text-center">
                Continue Your Adventure?
              </h2>
              {existingProgress && (
                <div className="mb-6">
                  <p className="text-white font-pressStart mb-3">
                    You have existing progress:
                  </p>
                  <div className="bg-gray-700 border border-bmGreen rounded-lg p-4 mb-4">
                    <div className="text-bmGreen font-pressStart text-lg">
                      Scene {existingProgress.currentSceneOrder || "Unknown"}
                    </div>
                    <div className="text-white font-pressStart text-sm">
                      Score: {existingProgress.score || 0} points
                    </div>
                    <div className="text-gray-300 font-pressStart text-xs">
                      Last played:{" "}
                      {existingProgress.lastAccessed
                        ? new Date(
                            existingProgress.lastAccessed
                          ).toLocaleString()
                        : "Unknown"}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleContinueGame}
                  className="flex-1 bg-bmGreen text-black px-4 py-3 rounded font-pressStart hover:bg-green-400 transition-colors">
                  Continue
                </button>
                <button
                  onClick={handleRestartGame}
                  className="flex-1 bg-bmRed text-white px-4 py-3 rounded font-pressStart hover:bg-red-600 transition-colors">
                  Start Over
                </button>
              </div>
            </div>
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
        console.log(
          "Rendering finished state, showScore:",
          showScore,
          "storyScore:",
          storyScore
        );
        if (showScore && storyScore) {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <div className="text-center text-white">
                <h1 className="text-4xl font-pressStart mb-8">
                  Story Completed!
                </h1>
                <div className="bg-bmGreen/20 border-2 border-bmYellow/50 rounded-xl p-8 max-w-md">
                  <h2 className="text-2xl font-pressStart mb-4 text-bmYellow">
                    Your Score
                  </h2>
                  <div className="text-6xl font-pressStart mb-4 text-bmGreen">
                    {storyScore.percentage}%
                  </div>
                  <div className="text-lg font-pressStart mb-2">
                    {storyScore.earnedPoints} / {storyScore.totalPossiblePoints}{" "}
                    points
                  </div>
                  <div className="text-sm font-pressStart text-gray-300">
                    {storyScore.totalQuestions} questions •{" "}
                    {storyScore.wrongAttempts} wrong attempts
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setShowMatchHistory(true);
                        fetchMatchHistory();
                      }}
                      className="bg-bmYellow text-black px-4 py-2 rounded font-pressStart hover:bg-yellow-400 transition-colors">
                      View Match History
                    </button>
                    <button
                      onClick={() => navigate("/home")}
                      className="bg-bmGreen text-white px-4 py-2 rounded font-pressStart hover:bg-green-600 transition-colors">
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <div className="text-center">
                <h1 className="text-white text-4xl font-pressStart mb-4">
                  Story Completed!
                </h1>
                <button
                  onClick={handleScoreDisplay}
                  className="bg-bmGreen text-white px-4 py-2 rounded font-pressStart">
                  Show Score (Test)
                </button>
              </div>
            </div>
          );
        }
      case "playing":
        return (
          dialogue && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
              <p className="text-bmYellow mb-2">{dialogue.characterName}</p>
              <p className="text-white">{dialogue.lineText}</p>
            </div>
          )
        );
      case "question":
        return (
          question && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
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
                      disabled={isAnswerLocked || status}
                      className={`p-3 w-full text-white font-pressStart rounded-md border-2 transition-colors text-center ${
                        isCorrect ? "bg-bmGreen border-white" : ""
                      } ${
                        status === "incorrect" ? "bg-bmRed border-gray-500" : ""
                      } ${
                        !status
                          ? "bg-gray-700 hover:bg-gray-600 border-bmYellow"
                          : ""
                      } ${
                        isAnswerLocked || status
                          ? "pointer-events-none cursor-default"
                          : "cursor-pointer"
                      }`}>
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
    <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative select-none">
      <BubbleMenu />
      <div
        onClick={handleInteraction}
        className={`aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600 transition-transform duration-75 cursor-pointer ${
          isShaking ? "animate-shake" : ""
        }`}
        style={{
          transform: `translateX(${shakeOffset}px)`,
          transition: "transform 0.05s ease-in-out",
        }}>
        {/* Background rendering */}
        {hasVisionTransition ? (
          <VisionTransition
            backgrounds={backgroundAssets}
            gameState={gameState}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: backgroundAssets[0]?.filePath
                ? `url('${backgroundAssets[0].filePath}')`
                : "",
            }}
          />
        )}
        {/* Opaque black overlay controlled by sprites */}
        {showBackgroundOverlay && (
          <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        )}
        {gameState !== "loading" && renderSprites()}
        {/* Correct answer feedback */}
        {showCorrectFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-[100]">
            <div className="bg-bmGreen text-white text-6xl font-pressStart px-8 py-4 rounded-xl border-4 border-white shadow-2xl animate-bounce">
              CORRECT!
            </div>
          </div>
        )}
        {renderGameState()}
      </div>

      {/* Match History Modal */}
      {showMatchHistory && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-[200]">
          <div className="bg-gray-800 border-2 border-bmYellow rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pressStart text-bmYellow">
                Match History
              </h2>
              <button
                onClick={() => setShowMatchHistory(false)}
                className="text-white hover:text-bmRed font-pressStart text-xl">
                ✕
              </button>
            </div>

            {matchHistory.length === 0 ? (
              <p className="text-white font-pressStart text-center py-8">
                No attempts recorded yet. Complete a story to see your match
                history!
              </p>
            ) : (
              <div className="space-y-3">
                {matchHistory.map((attempt, index) => (
                  <div
                    key={attempt.attemptId || index}
                    className="bg-gray-700 border border-bmGreen rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-pressStart text-bmYellow">
                          {attempt.storyTitle || `Story ${attempt.storyId}`}
                        </h3>
                        <p className="text-white font-pressStart text-sm">
                          {new Date(attempt.endAttemptDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-pressStart text-bmGreen">
                          {attempt.percentage?.toFixed(1)}%
                        </div>
                        <div className="text-sm font-pressStart text-gray-300">
                          {attempt.score} / {attempt.totalPossibleScore} pts
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-pressStart text-gray-400">
                      {attempt.completionTimeSeconds && (
                        <span>
                          Completed in{" "}
                          {Math.floor(attempt.completionTimeSeconds / 60)}m{" "}
                          {attempt.completionTimeSeconds % 60}s
                        </span>
                      )}
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
