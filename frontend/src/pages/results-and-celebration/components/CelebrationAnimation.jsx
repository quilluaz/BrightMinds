import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CelebrationAnimation = ({ isVisible = true }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        color: ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-warning'][Math.floor(Math.random() * 5)]
      }));
      
      // Generate floating stars
      const newStars = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        size: 16 + Math.random() * 16,
        color: ['text-accent', 'text-primary', 'text-secondary'][Math.floor(Math.random() * 3)]
      }));
      
      setConfettiPieces(newConfetti);
      setStars(newStars);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Confetti Animation */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-full animate-bounce-gentle`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: 'translateY(100vh) rotate(360deg)'
          }}
        />
      ))}
      
      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-bounce-gentle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: '3s'
          }}
        >
          <Icon 
            name="Star" 
            size={star.size} 
            className={`${star.color} opacity-70`}
          />
        </div>
      ))}
      
      {/* Sparkle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: '2s'
            }}
          >
            <Icon 
              name="Sparkles" 
              size={12 + Math.random() * 8} 
              className="text-accent opacity-60"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CelebrationAnimation;