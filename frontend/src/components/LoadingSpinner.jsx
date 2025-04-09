import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen animated-gradient">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div
          className="w-16 h-16 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin absolute top-0 left-0"
          style={{
            animationDirection: "reverse",
            animationDuration: "1s",
          }}></div>
      </div>
      <p className="ml-4 text-xl font-bold text-gray-700 dark:text-white">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;
