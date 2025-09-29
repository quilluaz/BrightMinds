import React, { useState, useEffect, useRef } from "react";

const AnimatedSprite = ({ asset, onAnimationComplete }) => {
  const [currentPosition, setCurrentPosition] = useState({
    x: asset.positionX ?? 0,
    y: asset.positionY ?? 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Check if this asset has animation metadata
  const hasAnimation =
    asset.metadata?.animation === "move" &&
    asset.metadata?.endX !== undefined &&
    asset.metadata?.endY !== undefined &&
    asset.metadata?.duration !== undefined;

  useEffect(() => {
    // Only start animation once when component mounts
    if (hasAnimation && !hasStartedRef.current) {
      hasStartedRef.current = true;
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        startAnimation();
      }, 100);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hasAnimation]);

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
        zIndex: asset.orderIndex || 1,
        transition: isAnimating ? "none" : "all 0.3s ease", // Smooth transition when not animating
      }}
    />
  );
};

export default AnimatedSprite;
