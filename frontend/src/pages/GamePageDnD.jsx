import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";
import AnimatedSprite from "@/components/ui/AnimatedSprite";
import DelayedSprite from "@/components/ui/DelayedSprite";
import DisappearingSprite from "@/components/ui/DisappearingSprite";
import VisionTransition from "@/components/ui/VisionTransition";
import { Howl, Howler } from "howler";

// Hardcoded positions for draggable mineral sprites
const DEFAULT_CHOICE_POSITIONS = [
  { x: -12, y: -2 },
  { x: -12, y: -12 },
  { x: 3.5, y: -2 },
  { x: 3.5, y: -12 },
];

export default function GamePageDnD() {
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

  // Typing effect and audio state
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("bm_audio_muted") === "true";
  });
  const typingIntervalRef = useRef(null);
  const preloadedAssetsRef = useRef({});
  const isTransitioning = useRef(false);
  const soundRef = useRef(null);

  // Drag-and-drop specific state
  const [draggableSprites, setDraggableSprites] = useState([]);
  const [dropTarget, setDropTarget] = useState(null);
  const [spritePositions, setSpritePositions] = useState({});
  const [disabledSprites, setDisabledSprites] = useState([]);
  const [currentQuestionScore, setCurrentQuestionScore] = useState(4);
  const [totalScore, setTotalScore] = useState(0);
  const [draggedSprite, setDraggedSprite] = useState(null);
  const [correctSprite, setCorrectSprite] = useState(null);

  const containerRef = useRef(null);

  // Mute toggle function
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("bm_audio_muted", newMuted.toString());
    Howler.mute(newMuted);
  };

  // Asset preloading function
  const preloadAssets = async (sceneIds) => {
    for (const sceneId of sceneIds) {
      try {
        const { data: gameScene } = await api.get(`/game/scene/${sceneId}`);

        gameScene.assets.forEach((asset) => {
          if (!asset.filePath || !asset.filePath.trim()) return;

          const key = `${sceneId}-${asset.assetId}`;
          if (preloadedAssetsRef.current[key]) return;

          if (asset.type === "background" || asset.type === "sprite") {
            const img = new Image();
            img.src = asset.filePath;
            preloadedAssetsRef.current[key] = img;
          } else if (asset.type === "audio") {
            if (asset.filePath && asset.filePath.trim()) {
              const sound = new Howl({
                src: [asset.filePath],
                preload: true,
                mute: isMuted,
              });
              preloadedAssetsRef.current[key] = sound;
            } else {
              console.warn("Skipping audio preload - empty filePath:", asset);
            }
          }
        });
      } catch (err) {
        console.warn("Failed to preload scene:", sceneId, err);
      }
    }
  };

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

  // ==== DRAG-AND-DROP HANDLERS ====

  // Initialize draggable sprites when scene loads
  const initializeDraggableSprites = (sceneData) => {
    if (!sceneData?.question || !sceneData?.assets) return;

    console.log("Initializing draggable sprites for scene:", sceneData.sceneId);

    // Find sprites with isDraggable metadata
    const draggables = sceneData.assets.filter(
      (asset) => asset.metadata?.isDraggable === true
    );

    // Find drop target
    const target = sceneData.assets.find(
      (asset) => asset.metadata?.dropTarget === true
    );

    console.log("Found draggable sprites:", draggables);
    console.log("Found drop target:", target);

    setDraggableSprites(draggables);
    setDropTarget(target);

    // Randomize positions for draggable sprites
    const shuffledPositions = [...DEFAULT_CHOICE_POSITIONS].sort(
      () => Math.random() - 0.5
    );

    const positions = {};
    draggables.forEach((sprite, index) => {
      positions[sprite.name] =
        shuffledPositions[index] || DEFAULT_CHOICE_POSITIONS[index];
    });

    console.log("Assigned sprite positions:", positions);
    setSpritePositions(positions);

    // Reset disabled sprites, score, and correct sprite for new question
    setDisabledSprites([]);
    setCurrentQuestionScore(4);
    setCorrectSprite(null);
  };

  // Convert rem units to pixels for position calculations
  const remToPx = (rem) => {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  // Check if a position is over the drop target
  const isOverDropTarget = (dragPosition, targetPosition) => {
    if (!targetPosition) return false;

    // Convert positions from rem to px for accurate collision detection
    const dragX = remToPx(dragPosition.x);
    const dragY = remToPx(dragPosition.y);
    const targetX = remToPx(targetPosition.x);
    const targetY = remToPx(targetPosition.y);

    // Define collision radius (in pixels)
    const collisionRadius = 100; // Adjust this for larger/smaller hit area

    const distance = Math.sqrt(
      Math.pow(dragX - targetX, 2) + Math.pow(dragY - targetY, 2)
    );

    console.log(
      "Drop detection - Distance:",
      distance,
      "Threshold:",
      collisionRadius
    );
    return distance < collisionRadius;
  };

  // Handle wrong answer
  const handleWrongAnswer = (sprite) => {
    console.log("Wrong answer - sprite:", sprite.name);

    // 1. Shake screen
    triggerScreenShake();

    // 2. Snap back happens automatically via dragSnapToOrigin

    // 3. Reduce question score (min 1)
    setCurrentQuestionScore((prev) => {
      const newScore = Math.max(1, prev - 1);
      console.log("Score reduced from", prev, "to", newScore);
      return newScore;
    });

    // 4. Increment mistakes for this question
    const questionId = currentSceneData?.question?.questionId;
    if (questionId) {
      setQuestionMistakes((prev) => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + 1,
      }));
    }

    // 5. Disable sprite (gray out, non-interactive)
    setDisabledSprites((prev) => [...prev, sprite.name]);

    console.log("Sprite disabled:", sprite.name);
  };

  // Handle correct answer
  const handleCorrectAnswer = async (sprite) => {
    console.log("Correct answer - sprite:", sprite.name);

    // 1. Snap sprite to EXACT drop target position
    if (dropTarget) {
      console.log("Snapping to drop target position:", {
        x: dropTarget.positionX,
        y: dropTarget.positionY,
      });
      setSpritePositions((prev) => ({
        ...prev,
        [sprite.name]: {
          x: dropTarget.positionX || 0,
          y: dropTarget.positionY || 0,
        },
      }));
    }

    // 2. Mark this sprite as correct for higher z-index rendering
    setCorrectSprite(sprite.name);

    // 3. Lock answer
    setIsAnswerLocked(true);

    // 4. Show correct feedback
    setShowCorrectFeedback(true);

    // 4. Update total score
    setTotalScore((prev) => prev + currentQuestionScore);
    console.log("Points awarded:", currentQuestionScore);

    // 5. Save progress (with score)
    await saveProgressAfterAnswer();

    // 6. Auto-proceed after delay
    setTimeout(() => {
      setShowCorrectFeedback(false);
      advanceToNextScene();
    }, 2000);
  };

  // Handle drag end
  const handleDragEnd = (sprite, info) => {
    if (isAnswerLocked || disabledSprites.includes(sprite.name)) {
      console.log("Drag ignored - answer locked or sprite disabled");
      return;
    }

    console.log("Drag ended for sprite:", sprite.name);
    console.log("Point:", info.point, "Offset:", info.offset);

    // Get container dimensions for proper coordinate conversion
    const container = containerRef.current;
    if (!container) {
      console.log("Container ref not available");
      resetSpritePosition(sprite.name);
      return;
    }

    const rect = container.getBoundingClientRect();

    // Get the sprite's current position from state
    const currentPos = spritePositions[sprite.name];
    if (!currentPos) {
      console.log("No position found for sprite");
      resetSpritePosition(sprite.name);
      return;
    }

    // Calculate the sprite's final position after drag
    // Start with the original position in percentage
    const originalX = ((currentPos.x + 10) / 20) * 100;
    const originalY = ((currentPos.y + 10) / 20) * 100;

    // Add the drag offset (convert pixels to percentage)
    const offsetXPercent = (info.offset.x / rect.width) * 100;
    const offsetYPercent = (-info.offset.y / rect.height) * 100; // Negative because y is inverted

    const finalX = originalX + offsetXPercent;
    const finalY = originalY + offsetYPercent;

    console.log("Original position (%):", { originalX, originalY });
    console.log("Drag offset (%):", { offsetXPercent, offsetYPercent });
    console.log("Final position (%):", { finalX, finalY });

    // Get drop target position in percentage
    const targetPos = dropTarget
      ? {
          x: ((dropTarget.positionX + 10) / 20) * 100,
          y: ((dropTarget.positionY + 10) / 20) * 100,
        }
      : null;

    console.log("Target position (%):", targetPos);

    // Check collision using percentage-based distance
    const distance = targetPos
      ? Math.sqrt(
          Math.pow(finalX - targetPos.x, 2) + Math.pow(finalY - targetPos.y, 2)
        )
      : Infinity;

    const threshold = 20; // 20% threshold for collision
    const isOver = distance < threshold;

    console.log(
      "Distance:",
      distance,
      "Threshold:",
      threshold,
      "Is over:",
      isOver
    );

    if (isOver) {
      console.log("=== DRAG END DEBUG ===");
      console.log("Sprite name:", sprite.name);
      console.log("Question:", currentSceneData?.question);
      console.log("All answers:", currentSceneData?.question?.answers);

      // Check if this is the correct sprite
      const answer = currentSceneData?.question?.answers.find((a) => {
        console.log(
          `Comparing: "${a.assetName}" === "${sprite.name}"?`,
          a.assetName === sprite.name
        );
        return a.assetName === sprite.name;
      });

      console.log("Found answer object:", answer);
      console.log("isCorrect value:", answer?.isCorrect);
      console.log("isCorrect type:", typeof answer?.isCorrect);
      console.log("Strict check (=== true):", answer?.isCorrect === true);

      // Use strict boolean check
      if (answer && answer.isCorrect === true) {
        console.log("✓ CORRECT ANSWER!");
        handleCorrectAnswer(sprite);
      } else {
        console.log("✗ WRONG ANSWER!");
        handleWrongAnswer(sprite);
      }
    } else {
      console.log("Sprite dropped outside target - snapping back");
      // framer-motion will automatically snap back via dragSnapToOrigin
    }
  };

  // Save progress after answering
  const saveProgressAfterAnswer = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("bm_user"));
      if (!user?.userId) return;

      // Get sceneId from scenes array, not from currentSceneData
      const currentSceneId =
        scenes[currentSceneIndex].sceneId ||
        scenes[currentSceneIndex].sceneOrder;

      const progressData = {
        userId: user.userId,
        storyId: parseInt(storyId),
        sceneId: currentSceneId,
        pointsEarned: currentQuestionScore,
        gameStartTime: gameStartTime ? gameStartTime.toISOString() : null,
        mistakeCount: mistakeCount,
        answerStates: selectedAnswers,
        perQuestionState: selectedAnswers,
        questionMistakes: questionMistakes,
      };

      await api.post("/game/save-scene-progress", progressData);
      console.log("Progress saved successfully:", {
        sceneId: currentSceneId,
        pointsEarned: currentQuestionScore,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Advance to next scene
  const advanceToNextScene = async () => {
    if (isTransitioning.current) {
      console.log("Already transitioning, ignoring advance request");
      return;
    }

    isTransitioning.current = true;
    console.log("Advancing to next scene");

    const nextIndex = currentSceneIndex + 1;

    if (nextIndex < scenes.length) {
      setCurrentSceneIndex(nextIndex);
      const nextSceneId =
        scenes[nextIndex].sceneId || scenes[nextIndex].sceneOrder;
      loadScene(nextSceneId).then(() => {
        setIsAnswerLocked(false);
        setGameState("playing");
        isTransitioning.current = false;
      });
    } else {
      // Game finished
      console.log("Story completed! Finishing game");
      await finishGame();
      // Don't reset isTransitioning for finished state
    }
  };

  // Finish game and save attempt
  const finishGame = async () => {
    console.log("Story completed! Setting finished state");
    setGameState("finished");

    // Calculate the story score using frontend counters and save the attempt
    calculateStoryScore()
      .then(() => {
        console.log("Story score calculated and attempt saved");
        // Show score after 3 seconds or when user clicks
        setTimeout(() => {
          console.log("3 seconds passed, showing score");
          handleScoreDisplay();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error calculating score or saving attempt:", error);
      });
    // Don't reset isTransitioning for finished state
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

      // Initialize drag-and-drop if scene has a question
      if (gameScene.question) {
        initializeDraggableSprites(gameScene);
      }

      // Reset background overlay counter when scene changes
      backgroundOverlayCountRef.current = 0;
      setShowBackgroundOverlay(false);

      if (soundRef.current) {
        soundRef.current.stop();
      }

      const dialogue = gameScene.dialogues?.[0];

      // Check for audio in dialogue voiceoverUrl first
      if (dialogue?.voiceoverUrl) {
        const sound = new Howl({
          src: [dialogue.voiceoverUrl],
          html5: true, // Good for streaming longer files
          mute: isMuted,
        });

        sound.play();
        soundRef.current = sound;
      } else {
        // Check for audio assets if no dialogue voiceover
        const audioAssets = gameScene.assets?.filter(
          (asset) => asset.type === "audio"
        );
        if (audioAssets && audioAssets.length > 0) {
          const audioAsset = audioAssets[0]; // Play the first audio asset
          if (audioAsset.filePath && audioAsset.filePath.trim()) {
            const sound = new Howl({
              src: [audioAsset.filePath],
              html5: true,
              mute: isMuted,
            });

            sound.play();
            soundRef.current = sound;
            console.log("Playing audio asset:", audioAsset.filePath);
          }
        }
      }

      // Preload next 2-3 scenes
      const nextScenes = scenes.slice(
        currentSceneIndex + 1,
        currentSceneIndex + 4
      );
      const nextSceneIds = nextScenes.map((s) => s.sceneId || s.sceneOrder);
      if (nextSceneIds.length > 0) {
        preloadAssets(nextSceneIds);
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

  // Typing effect for dialogues
  useEffect(() => {
    if (
      !currentSceneData ||
      !currentSceneData.dialogues ||
      gameState !== "playing"
    ) {
      setDisplayedText("");
      setIsTyping(false);
      setIsTextComplete(false);
      return;
    }

    const dialogue = currentSceneData.dialogues[0];
    if (!dialogue) {
      setDisplayedText("");
      setIsTyping(false);
      setIsTextComplete(false);
      return;
    }

    const fullText = dialogue.lineText;
    setIsTyping(true);
    setIsTextComplete(false);
    setDisplayedText("");

    let currentIndex = 0;
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setIsTextComplete(true);
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 50);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentSceneData, gameState]);

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

    // Two-click progression logic for dialogues
    if (
      gameState === "playing" &&
      currentSceneData?.dialogues &&
      !currentSceneData?.question
    ) {
      // First click: skip typing and stop audio
      if (isTyping || !isTextComplete) {
        // Clear the interval immediately
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }

        const dialogue = currentSceneData.dialogues[0];
        setDisplayedText(dialogue.lineText);
        setIsTyping(false);
        setIsTextComplete(true);

        // Stop audio
        if (soundRef.current) {
          soundRef.current.stop();
        }
        return;
      }

      // Second click: advance to next scene
      goToNextScene();
      return;
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

    // Calculate earned points from questionMistakes (not from totalScore state due to closure issues)
    // For each question, start with pointsPerQuestion and subtract mistakes (min 1 point)
    let earnedPoints = 0;
    let totalWrongAttempts = 0;

    // Get all question IDs that were answered
    const answeredQuestionIds = Object.keys(questionMistakes).map(Number);

    // For questions with recorded mistakes, calculate their points
    answeredQuestionIds.forEach((qId) => {
      const mistakesForQuestion = questionMistakes[qId];
      const questionPoints = Math.max(
        1,
        pointsPerQuestion - mistakesForQuestion
      );
      earnedPoints += questionPoints;
      totalWrongAttempts += mistakesForQuestion;
      console.log(
        `Question ${qId}: ${mistakesForQuestion} mistakes = ${questionPoints} points`
      );
    });

    // For questions without any mistakes (not in questionMistakes object), they get full points
    const questionsWithoutMistakes =
      totalQuestions - answeredQuestionIds.length;
    if (questionsWithoutMistakes > 0) {
      earnedPoints += questionsWithoutMistakes * pointsPerQuestion;
      console.log(
        `${questionsWithoutMistakes} questions with no mistakes = ${
          questionsWithoutMistakes * pointsPerQuestion
        } points`
      );
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

      // Reset typing effect and audio state
      setIsTyping(false);
      setDisplayedText("");
      setIsTextComplete(false);
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
      }

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

      // Check if this is a draggable sprite
      const isDraggable = asset.metadata?.isDraggable === true;
      const isDropTarget = asset.metadata?.dropTarget === true;

      // Render draggable sprites using framer-motion
      // Skip draggable rendering if this is the correct sprite - let it fall through to static rendering
      if (isDraggable && !isDropTarget && correctSprite !== asset.name) {
        const position = spritePositions[asset.name] || {
          x: asset.positionX || 0,
          y: asset.positionY || 0,
        };
        const isDisabled = disabledSprites.includes(asset.name);
        const scale = asset.metadata?.scale || 1;

        // Convert rem to percentage for positioning
        // Use the standard -10 to +10 range but remove clamping for flexibility
        const normalizedX = (position.x + 10) / 20;
        const normalizedY = (position.y + 10) / 20;

        return (
          <motion.img
            key={`${asset.assetId}-${currentSceneIndex}`}
            src={asset.filePath}
            alt={asset.name}
            drag={!isAnswerLocked && !isDisabled}
            dragElastic={0.2}
            dragMomentum={false}
            dragConstraints={containerRef}
            dragSnapToOrigin={true}
            onDragStart={() => setDraggedSprite(asset.name)}
            onDragEnd={(event, info) => {
              handleDragEnd(asset, info);
              setDraggedSprite(null);
            }}
            animate={{
              left: `${normalizedX * 100}%`,
              bottom: `${normalizedY * 100}%`,
              opacity: isDisabled ? 0.3 : 1,
              scale: scale,
              x: 0,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`absolute h-3/4 max-h-[80%] object-contain ${
              isDisabled
                ? "cursor-not-allowed pointer-events-none"
                : "cursor-grab active:cursor-grabbing"
            }`}
            style={{
              transform: "translateX(-50%)",
              zIndex: 30,
            }}
            whileDrag={{ scale: scale * 1.1, zIndex: 100 }}
          />
        );
      }

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
      // ALSO render the correct sprite here for perfect alignment with drop target
      const isCorrectSpriteAtTarget = correctSprite === asset.name;

      // Use drop target position if this is the correct sprite
      const spritePosition =
        isCorrectSpriteAtTarget && dropTarget
          ? { positionX: dropTarget.positionX, positionY: dropTarget.positionY }
          : { positionX: asset.positionX, positionY: asset.positionY };

      const normalizedX = ((spritePosition.positionX ?? 0) + 10) / 20;
      const normalizedY = ((spritePosition.positionY ?? 0) + 10) / 20;

      // Check if sprite should face left (flip horizontally)
      const shouldFaceLeft = asset.metadata?.facing === "left";

      // Get scale - use drop target scale if this is the correct sprite
      const scale =
        isCorrectSpriteAtTarget && dropTarget?.metadata?.scale
          ? dropTarget.metadata.scale
          : asset.metadata?.scale || 1;

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
      if (isCorrectSpriteAtTarget) {
        console.log(
          `✅ Rendering CORRECT sprite ${asset.name} at drop target position:`,
          spritePosition,
          "scale:",
          scale,
          "transform:",
          transformStyle,
          "zIndex: 50"
        );
      } else if (scale !== 1) {
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
            zIndex: isCorrectSpriteAtTarget ? 50 : (asset.orderIndex || 1) + 20, // Higher z-index for correct sprite
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-[200]">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-[200]">
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
              <p className="text-white">{displayedText || dialogue.lineText}</p>
              {isTextComplete && (
                <div className="absolute top-2 right-2 animate-pulse">
                  <span className="text-bmYellow font-pressStart text-xs">
                    Click to continue ▶
                  </span>
                </div>
              )}
            </div>
          )
        );
      case "question":
        return (
          question &&
          (question.type === "DragDrop" ? (
            /* Minimal UI for DragDrop questions */
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/80 rounded-lg border border-bmYellow/50 font-pressStart text-sm z-50">
              <p className="text-white text-center whitespace-nowrap">
                {question.promptText}
              </p>
            </div>
          ) : (
            /* Full UI for MCQ questions */
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg z-50">
              <p className="text-white text-center mb-4">
                {question.promptText}
              </p>
              <div className="grid grid-cols-2 gap-3 mx-4">
                {question.choices?.map((choice) => {
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
          ))
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative select-none">
      <BubbleMenu />

      {/* Mute Button - Outside game screen */}
      <div className="absolute top-4 right-4 z-[60]">
        <button
          onClick={toggleMute}
          className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-lg border-2 border-bmYellow/50 transition-colors">
          <span className="font-pressStart text-xs">
            {isMuted ? "🔇 Muted" : "🔊 Sound"}
          </span>
        </button>
      </div>
      <motion.div
        ref={containerRef}
        onClick={handleInteraction}
        className={`aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600 cursor-pointer ${
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
      </motion.div>

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
