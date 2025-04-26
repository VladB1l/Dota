import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UiInput from "@ui/UiInput/UiInput";
import SteamIcon from "@icons/SteamIcon";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [matchId, setMatchId] = useState("");
  const [error, setError] = useState("");

  const isActive = (path) => location.pathname.startsWith(path);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      if (!matchId.trim()) {
        setError("Please enter a Match ID.");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId }),
        });
        const data = await res.json();

        if (data.match) {
          setError("");
          setMatchId("");
          navigate(`/match/${matchId}`);
        } else {
          setError("Match not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error while searching match.");
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.searchBlock}>
        <UiInput
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search Match ID"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <nav className={styles.nav}>
        <Link to="/">Main Page</Link>|
        <Link to="/heroes" className={isActive("/heroes") ? styles.active : ""}>
          Heroes
        </Link>
        |
        <Link
          to="/matches"
          className={isActive("/matches") ? styles.active : ""}
        >
          Matches
        </Link>
      </nav>

      <a
        href="https://steamcommunity.com/openid/login"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.steamButton}
      >
        <SteamIcon className={styles.steamIcon} />
        Log In
      </a>
    </header>
  );
};

export default Header;
