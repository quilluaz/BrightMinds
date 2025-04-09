import React from "react";

const Avatar = ({
  src,
  alt,
  size = "md",
  bordered = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      className={`avatar ${bordered ? "avatar-bordered" : ""} ${
        sizeClasses[size]
      } ${className}`}>
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 font-bold text-xl">
          {alt ? alt.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </div>
  );
};

export default Avatar;
