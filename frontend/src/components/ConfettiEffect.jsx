import React, { useEffect, useState } from "react";

const ConfettiEffect = ({ active, duration = 3000 }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (active) {
      // Create confetti pieces
      const pieces = [];
      for (let i = 0; i < 100; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: ["#fddf7d", "#badefc", "#a0e7a0", "#ffb6c1"][Math.floor(Math.random() * 4)],
          size: Math.random() * 10 + 5,
          speed: Math.random() * 3 + 1,
        });
      }
      setConfetti(pieces);

      // Remove confetti after duration
      const timer = setTimeout(() => {
        setConfetti([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active && confetti.length === 0) return null;

  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
