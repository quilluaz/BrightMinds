import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import BubbleMenu from "@/components/ui/BubbleMenu";

export default function Game1() {
  const [gameState, setGameState] = useState("loading"); // loading, intro, playing, question, finished
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [dialogues, setDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [sprites, setSprites] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [error, setError] = useState("");

  // Simplified state for Liam's position
  const [liamPosition, setLiamPosition] = useState('left'); // left, middle

  const isTransitioning = useRef(false);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setGameState("loading");
        const scenesResponse = await api.get("/stories/1/scenes");
        if (!scenesResponse.data || scenesResponse.data.length === 0) {
          throw new Error("No scenes found for this story.");
        }
        setScenes(scenesResponse.data);
        await loadScene(scenesResponse.data[0]);
        setGameState("intro");
      } catch (err) {
        handleError("Could not load the story. Please try again later.", err);
      }
    };
    fetchStoryData();
  }, []);

  const handleError = (message, error) => {
    console.error(message, error);
    setError(message);
    setGameState("error");
  };

  const loadScene = async (scene) => {
    if (!scene) return;
    try {
      const [assetsRes, dialoguesRes, questionsRes] = await Promise.all([
        api.get(`/scene-assets/scene/${scene.sceneId}`),
        api.get(`/dialogues/scene/${scene.sceneId}`),
        api.get(`/questions/scene/${scene.sceneId}/full`),
      ]);
      
      const backgroundAsset = assetsRes.data.find(sa => sa.asset?.type === 'background');
      setBackgroundUrl(backgroundAsset ? backgroundAsset.asset.filePath : "");

      const spriteAssets = assetsRes.data.filter(sa => sa.asset?.type === 'sprite');
      setSprites(spriteAssets.map(sa => sa.asset));

      setDialogues(dialoguesRes.data);
      setQuestion(questionsRes.data.length > 0 ? questionsRes.data[0] : null);

    } catch (err) {
      handleError("A problem occurred while loading the scene.", err);
    }
  };

  const handleInteraction = async () => {
    if (isTransitioning.current || gameState === 'question' || gameState === 'finished') return;

    if (gameState === "intro") {
      setGameState("playing");
      return;
    }

    if (gameState !== "playing") return;

    const nextDialogueIndex = currentDialogueIndex + 1;
    if (nextDialogueIndex < dialogues.length) {
      setCurrentDialogueIndex(nextDialogueIndex);
       // Trigger Liam's walk animation on the third dialogue (index 2)
       if (nextDialogueIndex === 2) {
        setLiamPosition('middle');
      }
    } else {
        if (question) {
            setGameState('question');
        } else {
            goToNextScene();
        }
    }
  };

  const handleAnswerSelection = (choice) => {
    if (selectedAnswers[choice.choiceId]) return;

    setSelectedAnswers(prev => ({ ...prev, [choice.choiceId]: choice.isCorrect ? 'correct' : 'incorrect' }));

    if (choice.isCorrect) {
      isTransitioning.current = true;
      setTimeout(() => {
        setGameState('finished');
        isTransitioning.current = false;
      }, 2000);
    }
  };

  const goToNextScene = async () => {
    isTransitioning.current = true;
    setGameState("loading");
    setLiamPosition('left'); // Reset Liam for the next scene

    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < scenes.length) {
      setCurrentSceneIndex(nextIndex);
      setCurrentDialogueIndex(0);
      setSelectedAnswers({});
      await loadScene(scenes[nextIndex]);
      setGameState("playing");
    } else {
      setGameState("finished");
    }

    setTimeout(() => { isTransitioning.current = false; }, 200);
  };
  
  const getSprite = (name) => sprites.find(s => s.name === name);

  const renderSprites = () => {
    const liamIdle = getSprite('liam_idle');
    const liamWalk = getSprite('liam_walk');
    const litaThinking = getSprite('lita_thinking');
    
    // Determine which Liam sprite to show
    const showIdleLiam = liamPosition === 'left';
    const showWalkingLiam = liamPosition === 'middle';

    return (
      <>
        {/* Idle Liam, shows on the left */}
        {liamIdle && <img src={liamIdle.filePath} alt="Liam" className={`absolute bottom-0 left-4 h-3/4 transition-opacity duration-500 ${showIdleLiam ? 'opacity-100' : 'opacity-0'}`} />}
        
        {/* Walking Liam, transitions to the middle */}
        {liamWalk && <img src={liamWalk.filePath} alt="Liam Walking" className={`absolute bottom-0 h-3/4 transition-all duration-1000 ease-in-out ${showWalkingLiam ? 'left-1/2 -translate-x-1/2 opacity-100' : 'left-4 opacity-0'}`} />}
        
        {/* Elder Lita */}
        {litaThinking && <img src={litaThinking.filePath} alt="Elder Lita" className={`absolute bottom-0 right-4 h-3/4 transition-opacity duration-500 ${currentDialogueIndex > 1 ? 'opacity-0' : 'opacity-100'}`} />}
      </>
    );
  };

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return <div className="absolute inset-0 flex items-center justify-center bg-black/70"><p className="text-white font-pressStart">Loading...</p></div>;
      case "error":
        return <div className="absolute inset-0 flex items-center justify-center bg-bmRed"><p className="text-white font-pressStart">{error}</p></div>;
      case "intro":
        return <div className="absolute inset-0 flex items-center justify-center bg-black/50"><h1 className="text-white text-4xl font-pressStart animate-pulse">Press to Start</h1></div>;
      case "finished":
        return <div className="absolute inset-0 flex items-center justify-center bg-black/70"><h1 className="text-white text-4xl font-pressStart">Demo Completed!</h1></div>;
      case "playing":
        return dialogues.length > 0 && currentDialogueIndex < dialogues.length && (
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="bg-black/70 text-white p-6 rounded-xl border-2 border-bmYellow/50 font-pressStart text-lg">
                <p className="text-bmYellow mb-2">{dialogues[currentDialogueIndex].characterName}</p>
                <p>{dialogues[currentDialogueIndex].lineText}</p>
              </div>
            </div>
          );
      case 'question':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <p className="text-white font-pressStart text-2xl mb-8 text-center">{question.promptText}</p>
            {/* 2x2 Grid for choices */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
              {question.choices.map(choice => {
                const status = selectedAnswers[choice.choiceId];
                const isSelected = !!status;
                const isCorrect = status === 'correct';

                return (
                  <button
                    key={choice.choiceId}
                    onClick={() => handleAnswerSelection(choice)}
                    disabled={isSelected}
                    className={`p-4 text-white font-pressStart rounded-md border-4 transition-colors text-center
                      ${isCorrect ? 'bg-bmGreen border-white' : ''}
                      ${status === 'incorrect' ? 'bg-bmRed border-gray-500' : ''}
                      ${!isSelected ? 'bg-gray-700 hover:bg-gray-600 border-bmYellow' : ''}
                      ${isSelected ? 'cursor-not-allowed' : ''}
                    `}
                  >
                    {choice.choiceText}
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main 
      onClick={handleInteraction}
      className="min-h-screen w-full bg-bmGreen flex items-center justify-center p-4 relative cursor-pointer select-none"
    >
      <BubbleMenu />
      <div className="aspect-video w-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-gray-600">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : "" }}
        ></div>
        {(gameState === 'playing' || gameState === 'question') && renderSprites()}
        {renderGameState()}
      </div>
    </main>
  );
}