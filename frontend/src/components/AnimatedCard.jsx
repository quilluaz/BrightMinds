import React from "react";

const AnimatedCard = ({ children, className, hoverEffect = true }) => {
  return (
    <div className={`card ${hoverEffect ? "card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedCard;
