import React, { useState, useEffect } from "react";
import UiButton from "@/ui/UiButton/UiButton";
import PlayersShortStats from "@components/PlayersShortStats/PlayersShortStats";
import PlayersFullStats from "@components/PlayersFullStats/PlayersFullStats";
import StarIcon from "@icons/StarIcon";
import styles from "./MatchDisplay.module.css";

const MatchDisplay = ({ match, currentUser }) => {
  const [showFull, setShowFull] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleStats = () => setShowFull((prev) => !prev);

  useEffect(() => {
    const fetchFavorite = async () => {
      if (!currentUser) return;

      try {
        const res = await fetch(
          `http://localhost:4000/favorites/${currentUser.steamId32}`
        );
        const ids = await res.json();
        setIsFavorite(ids.map(Number).includes(match.id));
      } catch (err) {
        console.error("Ошибка при загрузке избранных:", err);
      }
    };

    fetchFavorite();
  }, [match.id, currentUser]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert("Please log in to use favorites.");
      return;
    }

    const method = isFavorite ? "DELETE" : "POST";

    try {
      await fetch("http://localhost:4000/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.steamId32,
          matchId: match.id,
        }),
      });

      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Ошибка при обновлении избранного:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>{match.didRadiantWin ? "Radiant win" : "Dire win"}</h2>
        <button
          onClick={handleToggleFavorite}
          className={styles.favoriteButton}
        >
          <StarIcon
            className={isFavorite ? styles.starIconActive : styles.starIcon}
            size={30}
          />
        </button>
      </div>

      <div className={styles.timeDuration}>
        <h3 className={styles.killsCount}>
          {match.radiantKills.reduce((s, k) => s + k, 0)}
        </h3>
        <h3>
          {Math.floor(match.durationSeconds / 60)}:
          {String(match.durationSeconds % 60).padStart(2, "0")}
        </h3>
        <h3 className={styles.killsCount}>
          {match.direKills.reduce((s, k) => s + k, 0)}
        </h3>
      </div>

      <UiButton
        text={showFull ? "Show Short Stats" : "Show Full Stats"}
        onClick={toggleStats}
        type="submit"
      />

      <div className={styles.teams}>
        {showFull ? (
          <>
            <PlayersFullStats
              team={match.players.filter((p) => p.isRadiant)}
              isRadiant={true}
            />
            <PlayersFullStats
              team={match.players.filter((p) => !p.isRadiant)}
              isRadiant={false}
            />
          </>
        ) : (
          <>
            <PlayersShortStats
              team={match.players.filter((p) => p.isRadiant)}
              isRadiant={true}
            />
            <PlayersShortStats
              team={match.players.filter((p) => !p.isRadiant)}
              isRadiant={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MatchDisplay;
