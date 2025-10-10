import React, { useState, useEffect, useRef } from "react";

const DisappearingSprite = ({ asset, onBackgroundOverlay }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const disappearTimeoutRef = useRef(null);
  const fadeAnimationRef = useRef(null);
  const backgroundOverlayNotifiedRef = useRef(false);

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
          onBackgroundOverlay(false);
        }
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
  };

  useEffect(() => {
    // Check if this sprite should trigger background overlay immediately
    if (
      asset.metadata?.triggerBackgroundOverlay &&
      onBackgroundOverlay &&
      !backgroundOverlayNotifiedRef.current
    ) {
      onBackgroundOverlay(true);
      backgroundOverlayNotifiedRef.current = true;
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
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      // Don't clear the disappear timeout on cleanup to prevent reset during state changes
    };
  }, []); // Empty dependency array to prevent reset on re-renders

  // Don't render if sprite should be invisible
  if (!isVisible) {
    return null;
  }

  // Convert coordinate system: -10 to 10 range maps to 0% to 100%
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

export default DisappearingSprite;
