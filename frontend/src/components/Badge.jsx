import React from "react";

const Badge = ({ children, color = "blue", className = "" }) => {
  return (
    <span className={`badge badge-${color} ${className}`}>{children}</span>
  );
};

export default Badge;
