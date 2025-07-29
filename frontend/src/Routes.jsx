import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginScreen from "pages/login-screen";
import Dashboard from "pages/dashboard";
import RegistrationScreen from "pages/registration-screen";
import ResultsAndCelebration from "pages/results-and-celebration";
import StoryLibrary from "pages/story-library";
import UserProfile from "pages/user-profile";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration-screen" element={<RegistrationScreen />} />
        <Route path="/results-and-celebration" element={<ResultsAndCelebration />} />
        <Route path="/story-library" element={<StoryLibrary />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;