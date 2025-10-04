import React, { useState, useEffect, useRef } from "react";

const AnimatedSprite = ({ asset, gameState, onAnimationComplete }) => {
  const [currentPosition, setCurrentPosition] = useState({
    x: asset.positionX ?? 0,
    y: asset.positionY ?? 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasStartedRef = useRef(false);
  const disappearTimeoutRef = useRef(null);
  const fadeAnimationRef = useRef(null);

  // Check if this asset has animation metadata
  const hasAnimation =
    asset.metadata?.animation === "move" &&
    asset.metadata?.endX !== undefined &&
    asset.metadata?.endY !== undefined &&
    asset.metadata?.duration !== undefined;

  useEffect(() => {
    // Only start animation once when component mounts and game is in playing state
    if (hasAnimation && !hasStartedRef.current && gameState === "playing") {
      hasStartedRef.current = true;
      // Delay to ensure the scene is fully loaded and visible
      setTimeout(() => {
        startAnimation();
      }, 300);
    }

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      if (disappearTimeoutRef.current) {
        clearTimeout(disappearTimeoutRef.current);
      }
    };
  }, [hasAnimation, asset.metadata?.disappearAfter, gameState]);

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

  const startAnimation = () => {
    if (!hasAnimation) return;

    console.log(`Starting animation for ${asset.name}:`, {
      startX: asset.positionX,
      startY: asset.positionY,
      endX: asset.metadata.endX,
      endY: asset.metadata.endY,
      duration: asset.metadata.duration,
    });

    setIsAnimating(true);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / (asset.metadata.duration * 1000), 1);

      // Use easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const startX = asset.positionX ?? 0;
      const startY = asset.positionY ?? 0;
      const endX = asset.metadata.endX;
      const endY = asset.metadata.endY;

      const currentX = startX + (endX - startX) * easeOut;
      const currentY = startY + (endY - startY) * easeOut;

      setCurrentPosition({ x: currentX, y: currentY });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        console.log(`Animation completed for ${asset.name}`);
        if (onAnimationComplete) {
          onAnimationComplete(asset.assetId);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Convert coordinate system: -10 to 10 range maps to 0% to 100%
  const normalizedX = (currentPosition.x + 10) / 20;
  const normalizedY = (currentPosition.y + 10) / 20;

  // Don't render if sprite should be invisible
  if (!isVisible) {
    return null;
  }

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

export default AnimatedSprite;
