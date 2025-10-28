import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("bm_user")) || {};

  // If no user is logged in, redirect to landing
  if (!user.userId) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "GAMEMASTER") {
      return <Navigate to="/gamemaster" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
