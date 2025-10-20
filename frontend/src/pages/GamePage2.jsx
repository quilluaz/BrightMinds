import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";
import AnimatedSprite from "@/components/ui/AnimatedSprite";
import DelayedSprite from "@/components/ui/DelayedSprite";
import DisappearingSprite from "@/components/ui/DisappearingSprite";
import VisionTransition from "@/components/ui/VisionTransition";

export default function GamePage2() {
  const { storyId } = useParams();

  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, puzzle, finished, progress-check
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentSceneData, setCurrentSceneData] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [error, setError] = useState("");
  const [storyScore, setStoryScore] = useState(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [questionMistakes, setQuestionMistakes] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);
  const [existingProgress, setExistingProgress] = useState(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeOffset, setShakeOffset] = useState(0);
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
            // For puzzle game, we might need to restore placed pieces
            // This would need to be adapted based on how puzzle progress is stored
            console.log("Restored answer states:", progress.answerStates);
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
      setScore(0);
      setPlacedPieces([]);
      setIsPuzzleComplete(false);
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

    // Fallback: if no questions found via API, use hardcoded count for story 2
    if (questionCount === 0 && storyId === "2") {
      questionCount = scenes.length; // Each scene has a puzzle
      console.log("Using fallback count for story 2:", questionCount);
    }

    setTotalQuestions(questionCount);
    console.log("Total questions in story:", questionCount);
  };

  // Load story data from API
  const loadStory = async () => {
    try {
      setError("");
      const response = await api.get(`/game/story/${storyId}`);
      console.log("Story data loaded:", response.data);
      setScenes(response.data.scenes || []);
      setTotalScore((response.data.scenes || []).length * 10); // Each scene is worth 10 points

      // Count total questions in the story
      await countTotalQuestions(response.data.scenes || []);

      // Check for existing progress before starting
      const progress = await checkExistingProgress();

      if (!progress) {
        // No existing progress, start fresh
        const firstSceneId =
          response.data.scenes[0].sceneId || response.data.scenes[0].sceneOrder;
        await loadScene(firstSceneId);
        setGameState("intro");
      }
      // If progress exists, the checkExistingProgress function will handle showing the dialog
    } catch (err) {
      console.error("Error loading story:", err);
      setError("Failed to load story data. Please try again.");
    }
  };

  // Initialize game
  useEffect(() => {
    if (storyId) {
      loadStory();
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

  // Load current scene data
  useEffect(() => {
    if (currentSceneIndex < scenes.length) {
      const scene = scenes[currentSceneIndex];
      setCurrentSceneData(scene);

      // Reset background overlay counter when scene changes
      backgroundOverlayCountRef.current = 0;
      setShowBackgroundOverlay(false);

      // Extract puzzle pieces from scene question answers
      if (scene.question && scene.question.answers) {
        const pieces = scene.question.answers.map((answer, index) => ({
          id: index + 1,
          shape: answer.answerText,
          color: answer.metadata?.color || "#FFD700",
          dragdropPosition: answer.dragdropPosition,
        }));
        setPuzzlePieces(pieces);
      } else {
        setPuzzlePieces([]);
      }

      setPlacedPieces([]);
      setIsPuzzleComplete(false);
      setShowCompletionEffect(false);
    }
  }, [currentSceneIndex, scenes]);

  // Check for metadata-based effects when scene data changes
  useEffect(() => {
    if (currentSceneData) {
      checkSceneEffects();
    }
  }, [currentSceneData]);

  // Render text display
  const renderTextDisplay = (asset) => {
    if (!asset.metadata?.pageText) return null;

    const textConfig = asset.metadata;
    const normalizedX = ((asset.positionX ?? 0) + 10) / 20;
    const normalizedY = ((asset.positionY ?? 0) + 10) / 20;

    console.log("Rendering text display:", {
      assetName: asset.name,
      textConfig,
      position: { x: normalizedX, y: normalizedY },
    });

    return (
      <div
        key={asset.assetId || asset.name}
        className="absolute font-pressStart pointer-events-none"
        style={{
          left: `${Math.max(0, Math.min(100, normalizedX * 100))}%`,
          bottom: `${Math.max(0, Math.min(100, normalizedY * 100))}%`,
          transform: "translateX(-50%)",
          // Simple container constraints
          width: textConfig.pageTextWidth || "250px",
          height: textConfig.pageTextHeight || "150px",
          // Text styling
          color: textConfig.pageTextColor || "#8B4513",
          fontSize: textConfig.pageTextSize || "12px",
          lineHeight: "1.4",
          textAlign: "left",
          // Visual styling
          zIndex: (asset.orderIndex || 1) + 20,
          backgroundColor:
            textConfig.pageTextBackground || "rgba(255,255,255,0.9)",
          border: textConfig.pageTextBorder || "1px solid #8B4513",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          // Text overflow handling
          overflow: "auto",
          wordWrap: "break-word",
        }}>
        {textConfig.pageText}
      </div>
    );
  };

  const handleInteraction = async () => {
    if (
      isTransitioning.current ||
      ["puzzle", "loading", "progress-check"].includes(gameState)
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

    if (gameState === "playing") {
      setGameState("puzzle");
      return;
    }
  };

  const handleDragStart = (e, piece) => {
    if (isPuzzleComplete) return;
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!draggedPiece || isPuzzleComplete) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if drop is in the puzzle area (right side of scrapbook)
    if (x > rect.width * 0.5) {
      const newPlacedPieces = [...placedPieces, { ...draggedPiece, x, y }];
      setPlacedPieces(newPlacedPieces);

      // Remove from available pieces
      setPuzzlePieces(puzzlePieces.filter((p) => p.id !== draggedPiece.id));

      // Check if puzzle is complete (all pieces placed)
      if (newPlacedPieces.length === currentSceneData.question.answers.length) {
        setIsPuzzleComplete(true);
        setShowCompletionEffect(true);

        // Calculate points earned based on mistakes for this specific question
        const questionId = currentSceneData?.question?.questionId;
        const currentMistakes = questionMistakes[questionId] || 0;
        const pointsPerQuestion = currentSceneData?.question?.points || 10;
        const pointsEarned = Math.max(0, pointsPerQuestion - currentMistakes);

        setScore(score + pointsEarned);

        console.log(
          `Puzzle completed for question ${questionId}! Points calculation:`,
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

        // Show completion effect for 2 seconds, then move to next scene
        setTimeout(() => {
          goToNextScene(true); // Skip progress save since we already updated it
        }, 2000);
      } else {
        // Increment mistake counter for this specific question
        const questionId = currentSceneData?.question?.questionId;
        let updatedQuestionMistakes = { ...questionMistakes };
        if (questionId) {
          updatedQuestionMistakes[questionId] =
            (updatedQuestionMistakes[questionId] || 0) + 1;
          setQuestionMistakes(updatedQuestionMistakes);
          console.log(
            `Wrong placement for question ${questionId}! Mistakes for this question:`,
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
        console.log(
          "Wrong placement! Global mistake count:",
          newGlobalMistakeCount
        );

        // Save wrong answer state immediately with current state
        const currentSceneId =
          scenes[currentSceneIndex].sceneId ||
          scenes[currentSceneIndex].sceneOrder;

        // Save immediately with the updated mistake counts
        try {
          await saveWrongAnswerState(currentSceneId);
          console.log("Wrong answer state saved to progress");
        } catch (error) {
          console.error("Failed to save wrong answer progress:", error);
        }

        // Show subtle screen shake for wrong answer
        setIsShaking(true);
        setShakeOffset(0);

        // Create shake animation
        const shakeInterval = setInterval(() => {
          setShakeOffset((prev) => (prev === 5 ? -5 : 5));
        }, 50);

        setTimeout(() => {
          clearInterval(shakeInterval);
          setIsShaking(false);
          // Ensure we return to center position
          setTimeout(() => {
            setShakeOffset(0);
          }, 10);
        }, 500); // Shake for 0.5 seconds
      }
    } else {
      // Dropped outside puzzle area - count as mistake
      const questionId = currentSceneData?.question?.questionId;
      let updatedQuestionMistakes = { ...questionMistakes };
      if (questionId) {
        updatedQuestionMistakes[questionId] =
          (updatedQuestionMistakes[questionId] || 0) + 1;
        setQuestionMistakes(updatedQuestionMistakes);
      }

      const newGlobalMistakeCount = mistakeCount + 1;
      setMistakeCount(newGlobalMistakeCount);

      // Save wrong answer state
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;
      await saveWrongAnswerState(currentSceneId);

      // Show screen shake
      setIsShaking(true);
      setShakeOffset(0);
      const shakeInterval = setInterval(() => {
        setShakeOffset((prev) => (prev === 5 ? -5 : 5));
      }, 50);
      setTimeout(() => {
        clearInterval(shakeInterval);
        setIsShaking(false);
        setTimeout(() => {
          setShakeOffset(0);
        }, 10);
      }, 500);
    }

    setDraggedPiece(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
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
        answerStates: {}, // For puzzle game, this might be different
        perQuestionState: {},
        questionMistakes: questionMistakes,
      };

      await api.post("/game/save-scene-progress", progressData);
      console.log("Scene progress saved:", {
        sceneId,
        pointsEarned,
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
        answerStates: {},
        perQuestionState: {},
        questionMistakes: questionMistakes,
      };

      await api.post("/game/save-wrong-answer", progressData);
      console.log("Wrong answer state saved:", {
        sceneId,
        mistakeCount,
      });
    } catch (error) {
      console.error("Failed to save wrong answer state:", error);
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

      console.log("Saving game attempt:", {
        userId: user.userId,
        storyId: storyId,
        score: score.earnedPoints,
        totalPossibleScore: score.totalPossiblePoints,
        startAttemptDate: startTimeISO,
        endAttemptDate: endTimeISO,
      });

      const response = await api.post("/game-attempts", attemptData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Game attempt saved successfully:", response.data);
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
      console.log("Match history fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch match history:", error);
    }
  };

  const calculateStoryScore = async () => {
    console.log("Calculating score with:", {
      totalQuestions,
      questionMistakes,
      mistakeCount,
    });

    // Each question is worth 10 points (as specified in puzzle game)
    const pointsPerQuestion = 10;
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
        await saveSceneProgress(currentSceneId, score);
      }

      setTimeout(() => {
        setCurrentSceneIndex(nextIndex);
        setGameState("playing");
        isTransitioning.current = false;
      }, 500);
    } else {
      // Game completed
      // Save progress for the last scene
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;
      await saveSceneProgress(currentSceneId, score);

      setTimeout(() => {
        setGameState("finished");
        isTransitioning.current = false;
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
      }, 500);
    }
  };

  // Render sprites with animation support
  const renderSprites = () => {
    if (!currentSceneData?.assets) return null;

    console.log("All assets in current scene:", currentSceneData.assets);

    const spriteAssets = currentSceneData.assets.filter(
      (asset) => asset.type === "sprite"
    );

    console.log("Filtered sprite assets:", spriteAssets);

    return spriteAssets.map((asset) => {
      // Debug logging for all assets
      console.log(`Processing asset: ${asset.name}`, {
        metadata: asset.metadata,
        hasAnimation:
          asset.metadata?.animation === "move" &&
          asset.metadata?.endX !== undefined &&
          asset.metadata?.endY !== undefined &&
          asset.metadata?.duration !== undefined,
        hasDelayedAppearance: asset.metadata?.appearAfter !== undefined,
        hasDisappearAfter: asset.metadata?.disappearAfter !== undefined,
      });

      // Check if this asset has animation metadata
      const hasAnimation =
        asset.metadata?.animation === "move" &&
        asset.metadata?.endX !== undefined &&
        asset.metadata?.endY !== undefined &&
        asset.metadata?.duration !== undefined;

      if (hasAnimation) {
        console.log(`Asset ${asset.name} going to AnimatedSprite`);
        return (
          <AnimatedSprite
            key={asset.assetId || asset.name}
            asset={asset}
            gameState={gameState}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      // Check if this asset has delayed appearance
      const hasDelayedAppearance = asset.metadata?.appearAfter !== undefined;

      if (hasDelayedAppearance) {
        console.log(`Asset ${asset.name} going to DelayedSprite`);
        return (
          <DelayedSprite
            key={asset.assetId || asset.name}
            asset={asset}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      // Check if this asset needs to disappear
      const hasDisappearAfter = asset.metadata?.disappearAfter !== undefined;

      if (hasDisappearAfter) {
        console.log(`Asset ${asset.name} going to DisappearingSprite`);
        return (
          <DisappearingSprite
            key={asset.assetId || asset.name}
            asset={asset}
            onBackgroundOverlay={handleBackgroundOverlay}
          />
        );
      }

      // Check if this is a text display
      if (asset.metadata?.pageText) {
        console.log(`Asset ${asset.name} going to text display rendering`);
        return renderTextDisplay(asset);
      }

      // Static sprite rendering for assets without animation, delay, or disappear
      console.log(`Asset ${asset.name} going to static rendering`);
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
          key={asset.assetId || asset.name}
          src={asset.filePath}
          alt={asset.name}
          className="absolute object-contain"
          style={{
            left: `${Math.max(0, Math.min(100, normalizedX * 100))}%`,
            bottom: `${Math.max(0, Math.min(100, normalizedY * 100))}%`,
            transform: transformStyle,
            transformOrigin: "center center",
            zIndex: (asset.orderIndex || 1) + 20,
            height: "75%",
            maxHeight: "80%",
          }}
        />
      );
    });
  };

  const renderPuzzlePiece = (piece, isPlaced = false) => {
    const pieceStyle = {
      backgroundColor: piece.color,
      width: isPlaced ? "60px" : "80px",
      height: isPlaced ? "60px" : "80px",
      borderRadius: "50%",
      border: "3px solid #FFD700",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      cursor: isPlaced ? "default" : "grab",
      position: isPlaced ? "absolute" : "relative",
      left: isPlaced ? `${piece.x - 30}px` : "auto",
      top: isPlaced ? `${piece.y - 30}px` : "auto",
      zIndex: isPlaced ? 10 : 5,
      transition: "all 0.3s ease",
    };

    return (
      <div
        key={piece.id}
        draggable={!isPlaced && !isPuzzleComplete}
        onDragStart={(e) => handleDragStart(e, piece)}
        onDragEnd={handleDragEnd}
        style={pieceStyle}
        className={`puzzle-piece ${isPlaced ? "placed" : "draggable"} ${
          showCompletionEffect ? "animate-pulse" : ""
        }`}
      />
    );
  };

  const renderCompletionEffect = () => {
    if (!showCompletionEffect || !currentSceneData) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="text-6xl font-pressStart text-white animate-bounce">
          ✨ Puzzle Complete! ✨
        </div>
      </div>
    );
  };

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <p className="text-white font-pressStart">Loading...</p>
          </div>
        );
      case "intro":
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl font-pressStart mb-4 animate-pulse">
                Nature's Treasures: Leah's Scrapbook Quest
              </h1>
              <p className="text-xl font-pressStart mb-6">
                Help Leah fix her mineral scrapbook by completing the puzzles!
              </p>
              <p className="text-lg font-pressStart">
                Click to start your adventure
              </p>
            </div>
          </div>
        );
      case "playing":
        return (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
            <p className="text-bmYellow mb-2">NARRATOR</p>
            <p className="text-white mb-4">
              {currentSceneData?.dialogues?.[0]?.lineText ||
                "Click to start the puzzle!"}
            </p>
            <p className="text-bmGreen text-center">
              Click to start the puzzle!
            </p>
          </div>
        );
      case "puzzle":
        return (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
            <p className="text-bmYellow mb-2">
              Puzzle:{" "}
              {currentSceneData?.question?.promptText || "Complete the puzzle!"}
            </p>
            <p className="text-white text-center">
              Drag the pieces to complete the picture!
            </p>
            <div className="text-center mt-2">
              <span className="text-bmGreen">
                {placedPieces.length} /{" "}
                {currentSceneData?.question?.answers?.length || 0} pieces placed
              </span>
            </div>
          </div>
        );
      case "finished":
        if (showScore) {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <div className="text-center text-white">
                <h1 className="text-4xl font-pressStart mb-8">
                  Scrapbook Complete!
                </h1>
                <div className="bg-bmGreen/20 border-2 border-bmYellow/50 rounded-xl p-8 max-w-md">
                  <h2 className="text-2xl font-pressStart mb-4 text-bmYellow">
                    Your Score
                  </h2>
                  <div className="text-6xl font-pressStart mb-4 text-bmGreen">
                    {Math.round((score / totalScore) * 100)}%
                  </div>
                  <div className="text-lg font-pressStart mb-2">
                    {score} / {totalScore} points
                  </div>
                  <div className="text-sm font-pressStart text-gray-300">
                    {scenes.length} minerals discovered
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
                  Scrapbook Complete!
                </h1>
                <p className="text-white text-xl font-pressStart mb-4">
                  Leah's mineral scrapbook is now perfect!
                </p>
                <button
                  onClick={() => setShowScore(true)}
                  className="bg-bmGreen text-white px-4 py-2 rounded font-pressStart">
                  View Score
                </button>
              </div>
            </div>
          );
        }
      default:
        return null;
    }
  };

  if (error) {
    return (
      <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center">
        <div className="text-white font-pressStart text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadStory()}
            className="bg-bmYellow text-bmBlack px-4 py-2 rounded font-pressStart">
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!currentSceneData) {
    return (
      <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center">
        <div className="text-white font-pressStart">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative select-none">
      <BubbleMenu />
      <div
        onClick={handleInteraction}
        className="aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200">
          {/* Render background assets */}
          {currentSceneData.assets
            ?.filter((asset) => asset.type === "background")
            .map((asset) => (
              <img
                key={asset.assetId || asset.name}
                src={asset.filePath}
                alt={asset.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}
        </div>

        {/* Opaque black overlay controlled by sprites */}
        {showBackgroundOverlay && (
          <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        )}

        {/* Render animated sprites */}
        {renderSprites()}

        {/* Scrapbook area for puzzle scenes */}
        {gameState === "puzzle" && currentSceneData.question && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-3/4 bg-red-800 border-4 border-red-900 rounded-lg">
            {/* Left page - Description */}
            <div className="absolute left-0 top-0 w-1/2 h-full bg-white border-r-2 border-gray-300 p-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-pressStart text-gray-800 mb-2">
                  Mineral Puzzle
                </h2>
                <div
                  className="w-16 h-16 mx-auto rounded-full border-4 border-gray-400"
                  style={{
                    backgroundColor: puzzlePieces[0]?.color || "#FFD700",
                  }}></div>
              </div>
              <p className="text-sm font-pressStart text-gray-700 leading-relaxed">
                {currentSceneData.question.promptText}
              </p>
            </div>

            {/* Right page - Puzzle area */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-100 border-l-2 border-gray-300 relative">
              {/* Placed puzzle pieces */}
              {placedPieces.map((piece) => renderPuzzlePiece(piece, true))}

              {/* Puzzle completion indicator */}
              {isPuzzleComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl animate-bounce">✨</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available puzzle pieces */}
        {gameState === "puzzle" && (
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 max-w-48">
            {puzzlePieces.map((piece) => renderPuzzlePiece(piece))}
          </div>
        )}

        {/* Completion effect */}
        {renderCompletionEffect()}

        {/* Game state overlay */}
        {renderGameState()}
      </div>
    </main>
  );
}
