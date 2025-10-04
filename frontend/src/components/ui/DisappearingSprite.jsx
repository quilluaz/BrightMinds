import React, { useState, useEffect, useRef } from "react";

const DisappearingSprite = ({ asset }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const disappearTimeoutRef = useRef(null);
  const fadeAnimationRef = useRef(null);

  const startFadeOut = () => {
    const fadeDuration = 500; // 0.5 seconds
    const startTime = Date.now();
    const startOpacity = opacity;

    const fadeAnimate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Linear fade from current opacity to 0
      const currentOpacity = startOpacity * (1 - progress);
      setOpacity(currentOpacity);

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
      } else {
        setIsVisible(false);
        console.log(`Sprite ${asset.name} completely disappeared`);
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
  };

  useEffect(() => {
    // Set up disappear timer if specified
    if (asset.metadata?.disappearAfter) {
      disappearTimeoutRef.current = setTimeout(() => {
        console.log(
          `Sprite ${asset.name} starting fade out after ${asset.metadata.disappearAfter} seconds`
        );
        startFadeOut();
      }, asset.metadata.disappearAfter * 1000);
    }

    return () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      if (disappearTimeoutRef.current) {
        clearTimeout(disappearTimeoutRef.current);
      }
    };
  }, [asset.metadata?.disappearAfter]);

  // Don't render if sprite should be invisible
  if (!isVisible) {
    return null;
  }

  // Convert coordinate system: -10 to 10 range maps to 0% to 100%
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
        zIndex: (asset.orderIndex || 1) + 20, // Ensure sprites appear above question overlay
        opacity: opacity, // Use opacity state for smooth fade
      }}
    />
  );
};

export default DisappearingSprite;

