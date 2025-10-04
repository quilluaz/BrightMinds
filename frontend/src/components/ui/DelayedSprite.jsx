import React, { useState, useEffect, useRef } from "react";

const DelayedSprite = ({ asset }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const appearTimeoutRef = useRef(null);
  const fadeAnimationRef = useRef(null);

  const startFadeIn = () => {
    const fadeDuration = 500; // 0.5 seconds
    const startTime = Date.now();
    const startOpacity = 0;

    const fadeAnimate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Linear fade from 0 to 1
      const currentOpacity = startOpacity + (1 - startOpacity) * progress;
      setOpacity(currentOpacity);

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
      } else {
        console.log(`Sprite ${asset.name} fully faded in`);
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
  };

  useEffect(() => {
    // Set up appear timer if specified
    if (asset.metadata?.appearAfter) {
      let delay = asset.metadata.appearAfter * 1000;
      if (asset.metadata?.delay) {
        delay += asset.metadata.delay * 1000;
      }

      appearTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        console.log(
          `Sprite ${asset.name} starting fade in after ${asset.metadata.appearAfter} seconds`
        );
        startFadeIn();
      }, delay);
    } else {
      // Show immediately if no delay specified
      setIsVisible(true);
      setOpacity(1);
    }

    return () => {
      if (appearTimeoutRef.current) {
        clearTimeout(appearTimeoutRef.current);
      }
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, [asset.metadata?.appearAfter, asset.metadata?.delay]);

  // Don't render if sprite should not be visible yet
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
        opacity: opacity,
      }}
    />
  );
};

export default DelayedSprite;
