import React, { useState, useEffect, useRef } from "react";

const VisionTransition = ({ backgrounds, gameState }) => {
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const transitionTimeoutRef = useRef(null);
  const flashAnimationRef = useRef(null);

  useEffect(() => {
    // Only start transition when game is in playing state
    if (gameState === "playing" && backgrounds.length > 1) {
      // Start transition after a short delay to let the scene settle
      transitionTimeoutRef.current = setTimeout(() => {
        startVisionTransition();
      }, 2000); // 2 second delay before vision starts
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (flashAnimationRef.current) {
        cancelAnimationFrame(flashAnimationRef.current);
      }
    };
  }, [gameState, backgrounds.length]);

  const startVisionTransition = () => {
    setIsTransitioning(true);

    // Create a gentle flash effect
    const flashDuration = 3000; // 3 seconds total transition
    const flashPeaks = 3; // Number of flash peaks
    const startTime = Date.now();

    const flashAnimate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / flashDuration, 1);

      if (progress < 1) {
        // Create gentle sine wave flashes that get more frequent
        const flashIntensity =
          Math.sin(progress * Math.PI * flashPeaks * 2) * 0.3;
        const baseFlash = Math.sin(progress * Math.PI) * 0.2; // Base fade

        // Combine base fade with gentle flashes
        const totalFlash = Math.max(0, baseFlash + flashIntensity);
        setFlashOpacity(totalFlash);

        flashAnimationRef.current = requestAnimationFrame(flashAnimate);
      } else {
        // Transition complete - switch to vision background
        setCurrentBackgroundIndex(1);
        setFlashOpacity(0);
        setIsTransitioning(false);
        console.log("Vision transition completed");
      }
    };

    flashAnimationRef.current = requestAnimationFrame(flashAnimate);
  };

  // Get current background
  const currentBackground = backgrounds[currentBackgroundIndex];
  const visionBackground = backgrounds[1]; // The vision background

  return (
    <div className="absolute inset-0">
      {/* Base background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: currentBackground
            ? `url('${currentBackground.filePath}')`
            : "",
        }}
      />

      {/* Vision background overlay (only visible during transition) */}
      {isTransitioning && visionBackground && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${visionBackground.filePath}')`,
            opacity: flashOpacity,
            transition: "opacity 0.1s ease-in-out",
          }}
        />
      )}

      {/* Flash overlay for the transition effect */}
      {isTransitioning && (
        <div
          className="absolute inset-0 bg-white"
          style={{
            opacity: flashOpacity * 0.4, // Gentle white flash
            transition: "opacity 0.1s ease-in-out",
          }}
        />
      )}
    </div>
  );
};

export default VisionTransition;

