import React from "react";
import AnimatedSprite from "./AnimatedSprite";

// Test component to demonstrate the animation functionality
const AnimationTest = () => {
  // Sample asset data based on your JSON structure
  const testAsset = {
    assetId: "test_liam_walk",
    name: "liam_walk",
    type: "sprite",
    filePath:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1758639079/liam_walk.png",
    positionX: -6,
    positionY: -9,
    orderIndex: 3,
    isInteractive: false,
    metadata: {
      character: "Liam",
      state: "walking",
      animation: "move",
      endX: 0,
      endY: -9,
      duration: 2,
    },
  };

  const handleAnimationComplete = (assetId) => {
    console.log(`Test animation completed for: ${assetId}`);
  };

  // Convert coordinates to percentage for visual indicators
  const startXPercent = ((testAsset.positionX + 10) / 20) * 100;
  const startYPercent = ((testAsset.positionY + 10) / 20) * 100;
  const endXPercent = ((testAsset.metadata.endX + 10) / 20) * 100;
  const endYPercent = ((testAsset.metadata.endY + 10) / 20) * 100;

  return (
    <div className="w-full h-96 bg-gray-800 relative border-2 border-gray-600 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-green-400">
        {/* Background representation */}
      </div>

      {/* Animation path indicator */}
      <div
        className="absolute w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        style={{
          left: `${Math.max(0, Math.min(100, startXPercent))}%`,
          bottom: `${Math.max(0, Math.min(100, startYPercent))}%`,
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
        title="Start Position"
      />
      <div
        className="absolute w-2 h-2 bg-green-500 rounded-full border-2 border-white"
        style={{
          left: `${Math.max(0, Math.min(100, endXPercent))}%`,
          bottom: `${Math.max(0, Math.min(100, endYPercent))}%`,
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
        title="End Position"
      />

      {/* Animation line */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <line
          x1={`${Math.max(0, Math.min(100, startXPercent))}%`}
          y1={`${100 - Math.max(0, Math.min(100, startYPercent))}%`}
          x2={`${Math.max(0, Math.min(100, endXPercent))}%`}
          y2={`${100 - Math.max(0, Math.min(100, endYPercent))}%`}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      <AnimatedSprite
        asset={testAsset}
        onAnimationComplete={handleAnimationComplete}
      />

      <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded font-mono text-sm">
        <div>
          Start: ({testAsset.positionX}, {testAsset.positionY})
        </div>
        <div>
          End: ({testAsset.metadata.endX}, {testAsset.metadata.endY})
        </div>
        <div>Duration: {testAsset.metadata.duration}s</div>
        <div className="text-xs mt-1">
          <span className="text-red-400">●</span> Start
          <span className="text-green-400 ml-2">●</span> End
        </div>
      </div>
    </div>
  );
};

export default AnimationTest;
