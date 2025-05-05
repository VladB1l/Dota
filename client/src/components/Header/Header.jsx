import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UiInput from "@ui/UiInput/UiInput";
import SteamIcon from "@icons/SteamIcon";
import LogOutIcon from "@icons/LogOutIcon";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [matchId, setMatchId] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

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

  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.leftPart}>
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
          <Link to="/" className={isActive("/") ? styles.active : styles.link}>
            Main Page
          </Link>
          |
          <Link
            to="/heroes"
            className={isActive("/heroes") ? styles.active : styles.link}
          >
            Heroes
          </Link>
          {/* |
          <Link
            to="/matches"
            className={isActive("/matches") ? styles.active : styles.link}
          >
            Matches
          </Link> */}
        </nav>
      </div>

      {user ? (
        <div className={styles.profileBlock}>
          <Link to={`/player/${user.steamId32}`} className={styles.profileLink}>
            <img
              src={user.avatar}
              alt="Avatar"
              className={styles.avatar}
            />
            <span className={styles.username}>{user.displayName}</span>
          </Link>
          <a
            href="http://localhost:4000/logout"
            className={styles.logoutButton}
          >
            <LogOutIcon className={styles.logoutIcon} />
          </a>
        </div>
      ) : (
        <a
          href="http://localhost:4000/auth/steam"
          className={styles.steamButton}
        >
          <SteamIcon className={styles.steamIcon} />
          Log In
        </a>
      )}
    </header>
  );
};

export default Header;
