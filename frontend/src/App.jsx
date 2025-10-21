import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import Home from "@/pages/Home";
import GameRouter from "@/components/GameRouter";
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
              <GameRouter />
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
