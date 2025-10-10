import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import Home from "@/pages/Home";
import GamePage from "@/pages/GamePage";
import GamePage2 from "@/pages/GamePage2";
import About from "@/pages/About";
import Settings from "@/pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/play/:storyId" element={<GamePage />} />
        <Route path="/play2/:storyId" element={<GamePage2 />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
