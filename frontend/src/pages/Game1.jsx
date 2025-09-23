import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";

export default function Game1() {
  const [currentScene, setCurrentScene] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSceneData = async () => {
      try {
        const scenesResponse = await api.get("/stories/1/scenes");
        
        if (!scenesResponse.data || scenesResponse.data.length === 0) {
          throw new Error("No scenes found for this story.");
        }
        
        const firstScene = scenesResponse.data[0];
        setCurrentScene(firstScene);

        const assetsResponse = await api.get(`/scene-assets/scene/${firstScene.sceneId}`);
        
        const backgroundAsset = assetsResponse.data.find(
          (sa) => sa.asset && sa.asset.type === 'background'
        );

        if (backgroundAsset) {
          setBackgroundUrl(backgroundAsset.asset.filePath);
        } else {
          console.warn("No background asset found for this scene.");
        }

      } catch (err) {
        console.error("Failed to fetch scene data:", err);
        setError("Could not load the story. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSceneData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen w-full bg-bmGreen flex items-center justify-center text-white font-pressStart">Loading Scene...</div>;
  }

  if (error) {
    return <div className="min-h-screen w-full bg-bmRed flex items-center justify-center text-white font-pressStart">{error}</div>;
  }

  return (
    <main className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative">
      <BubbleMenu />
      <div className="aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600">
        
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : "none",
          }}
        ></div>

        <div className="absolute inset-0">
          {/* Character sprites will go here */}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="bg-black/70 text-white p-6 rounded-xl border-2 border-bmYellow/50">
            {currentScene && (
              <div dangerouslySetInnerHTML={{ __html: currentScene.sceneText }} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}