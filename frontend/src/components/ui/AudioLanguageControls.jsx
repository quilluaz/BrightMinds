import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Globe, Languages } from "lucide-react";

export default function AudioLanguageControls({
  masterVolume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  currentLanguage,
  onLanguageChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsExpanded(false);
    }, 500); // 500ms delay before auto-collapse
    setHoverTimeout(timeout);
  };

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  const handleMuteClick = () => {
    onToggleMute();
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === "en" ? "tl" : "en";
    onLanguageChange(newLanguage);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <div
      ref={containerRef}
      className="transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {/* Folder Tab Container */}
      <div
        className={`
          bg-bmYellow border-2 border-bmBlack rounded-t-lg shadow-[4px_4px_0_#000]
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64 h-32" : "w-16 h-12"}
        `}
        style={{
          clipPath: isExpanded
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}>
        {/* Collapsed State - Icon Strip */}
        {!isExpanded && (
          <div className="flex flex-row items-center justify-center h-full space-x-1">
            <button
              onClick={handleMuteClick}
              className="p-1 hover:bg-bmBlack/10 rounded transition-colors"
              title={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-bmBlack" />
              ) : (
                <Volume2 className="w-4 h-4 text-bmBlack" />
              )}
            </button>
            <button
              onClick={handleLanguageToggle}
              className="p-1 hover:bg-bmBlack/10 rounded transition-colors"
              title={`Switch to ${
                currentLanguage === "en" ? "Tagalog" : "English"
              }`}>
              <Globe className="w-4 h-4 text-bmBlack" />
            </button>
          </div>
        )}

        {/* Expanded State - Full Controls */}
        {isExpanded && (
          <div className="p-3 space-y-3">
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-pressStart text-bmBlack">
                  Volume
                </span>
                <span className="text-xs font-pressStart text-bmBlack">
                  {masterVolume}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMuteClick}
                  className="p-1 hover:bg-bmBlack/10 rounded transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-bmBlack" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-bmBlack" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={handleVolumeSliderChange}
                  className="flex-1 h-2 bg-bmBlack/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3ea66b 0%, #3ea66b ${masterVolume}%, #e5e7eb ${masterVolume}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Language Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-pressStart text-bmBlack">
                  Language
                </span>
                <span className="text-xs font-pressStart text-bmBlack">
                  {currentLanguage === "en" ? "English" : "Tagalog"}
                </span>
              </div>
              <button
                onClick={handleLanguageToggle}
                className="w-full flex items-center justify-center space-x-2 p-2 bg-bmBlack/10 hover:bg-bmBlack/20 rounded transition-colors"
                title={`Switch to ${
                  currentLanguage === "en" ? "Tagalog" : "English"
                }`}>
                <Globe className="w-4 h-4 text-bmBlack" />
                <span className="text-xs font-pressStart text-bmBlack">
                  {currentLanguage === "en" ? "🇵🇭 Tagalog" : "🇺🇸 English"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
