import React, { useState, useEffect, useRef } from "react";

const DelayedSprite = ({ asset, onCorrectSpriteAppear }) => {
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

      // Use easing function for smooth fadein (ease-out for fadein)
      const easeOut = 1 - Math.pow(1 - progress, 2);

      // Linear fade from 0 to 1 with easing
      const currentOpacity = startOpacity + (1 - startOpacity) * easeOut;
      setOpacity(currentOpacity);

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
      } else {
        console.log(`Sprite ${asset.name} fully faded in`);

        // Check if this is a correct sprite and notify parent
        if (
          asset.name &&
          asset.name.toLowerCase().includes("correct") &&
          onCorrectSpriteAppear
        ) {
          onCorrectSpriteAppear(true);
        }
      }
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeAnimate);
  };

  useEffect(() => {
    // Set up appear timer if specified and not already set
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
      }, delay);
    } else if (!asset.metadata?.appearAfter && !isVisible) {
      // Show immediately if no delay specified and not already visible
      setIsVisible(true);
      setOpacity(1);

      // Check if this is a correct sprite and notify parent
      if (
        asset.name &&
        asset.name.toLowerCase().includes("correct") &&
        onCorrectSpriteAppear
      ) {
        onCorrectSpriteAppear(true);
      }
    }

    return () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      // Don't clear appear timeout on cleanup to prevent reset during state changes
    };
  }, []); // Empty dependency array to prevent reset on re-renders

  // Don't render if sprite should not be visible yet
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
        opacity: opacity,
      }}
    />
  );
};

export default DelayedSprite;
