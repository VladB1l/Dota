import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import HeroesPage from "./pages/HeroesPage/HeroesPage";
import MatchesPage from "./pages/MatchesPage/MatchesPage";
import MatchPage from "./pages/MatchPage/MatchPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/heroes" element={<HeroesPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/match/:id" element={<MatchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
