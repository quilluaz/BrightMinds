import React, { useState, useEffect, useRef } from "react";

const AnimatedSprite = ({
  asset,
  gameState,
  onAnimationComplete,
  onBackgroundOverlay,
}) => {
  const [currentPosition, setCurrentPosition] = useState({
    x: asset.positionX ?? 0,
    y: asset.positionY ?? 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasStartedRef = useRef(false);
  const disappearTimeoutRef = useRef(null);
  const fadeAnimationRef = useRef(null);
  const appearTimeoutRef = useRef(null);
  const backgroundOverlayNotifiedRef = useRef(false);

  // Check if this asset has animation metadata
  const hasAnimation =
    asset.metadata?.animation === "move" &&
    asset.metadata?.endX !== undefined &&
    asset.metadata?.endY !== undefined &&
    asset.metadata?.duration !== undefined;

  useEffect(() => {
    // Handle appearAfter timing - only set up if not already set
    if (asset.metadata?.appearAfter && !appearTimeoutRef.current) {
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

        // Start animation after fade in if it has animation
        if (hasAnimation && !hasStartedRef.current && gameState === "playing") {
          hasStartedRef.current = true;
          setTimeout(() => {
            startAnimation();
          }, 500); // Wait for fade in to complete
        }
      }, delay);
    } else if (!asset.metadata?.appearAfter && !isVisible) {
      // Show immediately if no appearAfter specified and not already visible
      setIsVisible(true);
      setOpacity(1);

      // Check if this sprite should trigger background overlay immediately
      if (
        asset.metadata?.triggerBackgroundOverlay &&
        onBackgroundOverlay &&
        !backgroundOverlayNotifiedRef.current
      ) {
        console.log(
          `AnimatedSprite ${asset.name} requesting background overlay (immediate)`
        );
        onBackgroundOverlay(true);
        backgroundOverlayNotifiedRef.current = true;
      }

      // Start animation immediately if it has animation
      if (hasAnimation && !hasStartedRef.current && gameState === "playing") {
        hasStartedRef.current = true;
        setTimeout(() => {
          startAnimation();
        }, 300);
      }
    }

    // Handle disappearAfter timing - only set up if not already set
    if (asset.metadata?.disappearAfter && !disappearTimeoutRef.current) {
      let delay = asset.metadata.disappearAfter * 1000;

      disappearTimeoutRef.current = setTimeout(() => {
        console.log(
          `Sprite ${asset.name} starting fade out after ${asset.metadata.disappearAfter} seconds`
        );
        startFadeOut();
      }, delay);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      // Don't clear timeouts on cleanup to prevent reset during state changes
    };
  }, []); // Empty dependency array to prevent reset on re-renders

  const startFadeIn = () => {
    const fadeDuration = 500; // 0.5 seconds
    const startTime = Date.now();
    const startOpacity = 0;

    const fadeAnimate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Use easing function for smooth fadein (ease-out for fadein)
      const easeOut = 1 - Math.pow(1 - progress, 2);

      // Linear fade from 0 to 1 with easing
      const currentOpacity = startOpacity + (1 - startOpacity) * easeOut;
      setOpacity(currentOpacity);

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
      } else {
        console.log(`Sprite ${asset.name} fully faded in`);

        // Check if this sprite should trigger background overlay
        if (
          asset.metadata?.triggerBackgroundOverlay &&
          onBackgroundOverlay &&
          !backgroundOverlayNotifiedRef.current
        ) {
          console.log(
            `AnimatedSprite ${asset.name} requesting background overlay`
          );
          onBackgroundOverlay(true);
          backgroundOverlayNotifiedRef.current = true;
        }
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
  };

  const startFadeOut = () => {
    const fadeDuration = 500; // 0.5 seconds - same as fade in
    const startTime = Date.now();
    const startOpacity = 1; // Always start from full opacity for consistent fadeout

    const fadeAnimate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Use easing function for smooth fadeout (ease-in for fadeout)
      const easeIn = Math.pow(progress, 2);

      // Linear fade from 1 to 0 with easing
      const currentOpacity = startOpacity * (1 - easeIn);
      setOpacity(currentOpacity);

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
      } else {
        setIsVisible(false);
        console.log(`Sprite ${asset.name} completely disappeared`);

        // Hide background overlay when sprite disappears
        if (asset.metadata?.triggerBackgroundOverlay && onBackgroundOverlay) {
          console.log(
            `AnimatedSprite ${asset.name} releasing background overlay`
          );
          onBackgroundOverlay(false);
        }
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
      `AnimatedSprite ${asset.name} scale:`,
      scale,
      "transform:",
      transformStyle
    );
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
        transform: transformStyle,
        transformOrigin: "center center",
        zIndex: (asset.orderIndex || 1) + 20, // Ensure sprites appear above question overlay
        opacity: opacity, // Use opacity state for smooth fade
      }}
    />
  );
};

export default AnimatedSprite;
