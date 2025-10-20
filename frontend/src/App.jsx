import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import Home from "@/pages/Home";
import GamePage from "@/pages/GamePage";
import GamePage2 from "@/pages/GamePage2";
import About from "@/pages/About";
import Settings from "@/pages/Settings";
import GameMasterDashboard from "@/pages/GameMasterDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes for all authenticated users */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/play/:storyId"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/play2/:storyId"
          element={
            <ProtectedRoute>
              <GamePage2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Game Master only routes */}
        <Route
          path="/gamemaster"
          element={
            <ProtectedRoute allowedRoles={["GAMEMASTER"]}>
              <GameMasterDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
