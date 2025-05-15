import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import HeroesPage from "./pages/HeroesPage/HeroesPage";
import MatchesPage from "./pages/MatchesPage/MatchesPage";
import MatchPage from "./pages/MatchPage/MatchPage";
import PlayerPage from "./pages/PlayerPage/PlayerPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user));
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/heroes" element={<HeroesPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route
          path="/match/:id"
          element={<MatchPage currentUser={currentUser} />}
        />
        <Route
          path="/player/:steamId"
          element={<PlayerPage currentUser={currentUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
