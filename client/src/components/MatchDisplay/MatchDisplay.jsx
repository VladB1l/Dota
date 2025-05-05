import React, { useState } from "react";
import UiButton from "@/ui/UiButton/UiButton";
import PlayersShortStats from "@components/PlayersShortStats/PlayersShortStats";
import PlayersFullStats from "@components/PlayersFullStats/PlayersFullStats";
import styles from "./MatchDisplay.module.css";

const MatchDisplay = ({ match }) => {
  const [showFull, setShowFull] = useState(false);
  const toggleStats = () => setShowFull((prev) => !prev);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {match.didRadiantWin ? "Radiant win" : "Dire win"}
      </h2>
      <div className={styles.timeDuration}>
        <h3>{match.radiantKills.reduce((s, k) => s + k, 0)}</h3>
        <h3>
          {Math.floor(match.durationSeconds / 60)}:
          {String(match.durationSeconds % 60).padStart(2, "0")}
        </h3>
        <h3>{match.direKills.reduce((s, k) => s + k, 0)}</h3>
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
