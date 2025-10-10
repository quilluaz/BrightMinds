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

  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, puzzle, finished
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
  const [isShaking, setIsShaking] = useState(false);
  const [shakeOffset, setShakeOffset] = useState(0);

  const isTransitioning = useRef(false);

  // Shake animation function
  const triggerShakeAnimation = (duration = 500, intensity = 5) => {
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

  // Load story data from API
  const loadStory = async () => {
    try {
      setError("");
      const response = await api.get(`/game/story/${storyId}`);
      console.log("Story data loaded:", response.data);
      setScenes(response.data.scenes || []);
      setTotalScore((response.data.scenes || []).length * 10); // Each scene is worth 10 points
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

  // Load current scene data
  useEffect(() => {
    if (currentSceneIndex < scenes.length) {
      const scene = scenes[currentSceneIndex];
      setCurrentSceneData(scene);

      // Check for shake animation metadata in scene assets
      if (scene.assets) {
        scene.assets.forEach((asset) => {
          if (asset.metadata?.shakeAnimation?.trigger === "onSceneStart") {
            const { duration = 500, intensity = 5 } =
              asset.metadata.shakeAnimation;
            triggerShakeAnimation(duration, intensity);
          }
        });
      }

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

  const handleInteraction = () => {
    if (isTransitioning.current || gameState === "puzzle") return;

    if (gameState === "loading") {
      setGameState("intro");
      return;
    }

    if (gameState === "intro") {
      setGameState("playing");
      setGameStartTime(new Date());
      return;
    }

    if (gameState === "playing") {
      setGameState("puzzle");
      return;
    }

    if (gameState === "finished" && !showScore) {
      setShowScore(true);
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

  const handleDrop = (e) => {
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
        setScore(score + (currentSceneData.question.points || 10));

        // Show completion effect for 2 seconds, then move to next scene
        setTimeout(() => {
          goToNextScene();
        }, 2000);
      }
    }

    setDraggedPiece(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const goToNextScene = () => {
    isTransitioning.current = true;
    setGameState("loading");

    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < scenes.length) {
      setTimeout(() => {
        setCurrentSceneIndex(nextIndex);
        setGameState("playing");
        isTransitioning.current = false;
      }, 500);
    } else {
      // Game completed
      setTimeout(() => {
        setGameState("finished");
        isTransitioning.current = false;
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
          />
        );
      }

      // Check if this asset has delayed appearance
      const hasDelayedAppearance = asset.metadata?.appearAfter !== undefined;

      if (hasDelayedAppearance) {
        console.log(`Asset ${asset.name} going to DelayedSprite`);
        return (
          <DelayedSprite key={asset.assetId || asset.name} asset={asset} />
        );
      }

      // Check if this asset needs to disappear
      const hasDisappearAfter = asset.metadata?.disappearAfter !== undefined;

      if (hasDisappearAfter) {
        console.log(`Asset ${asset.name} going to DisappearingSprite`);
        return (
          <DisappearingSprite key={asset.assetId || asset.name} asset={asset} />
        );
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
        className={`aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600 cursor-pointer ${
          isShaking ? "animate-shake" : ""
        }`}
        style={{
          transform: `translateX(${shakeOffset}px)`,
          transition: "transform 0.05s ease-in-out",
        }}
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
