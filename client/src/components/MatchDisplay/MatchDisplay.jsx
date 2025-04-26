import React from "react";
import styles from "./MatchDisplay.module.css";

const MatchDisplay = ({ match, optimization }) => {
  const renderPlayers = (team, isRadiant) => (
    <div className={styles.team} style={getTeamStyle(isRadiant)}>
      <h3 className={styles.label} style={getLabelStyle(isRadiant)}>
        {isRadiant ? "Radiant" : "Dire"}
      </h3>
      {team.map((player, index) => (
        <div className={styles.player} key={index}>
          <img
            src={`https://cdn.stratz.com/images/dota2/heroes/${player.hero.shortName}_icon.png`}
            alt={player.hero.displayName}
          />
          <p>{player.steamAccount?.name || "Unknown"}</p>
          <div
            className={styles.kda}
          >{`${player.kills} / ${player.deaths} / ${player.assists}`}</div>
        </div>
      ))}
    </div>
  );
  const getTeamStyle = (isRadiant) => ({
    backgroundColor: isRadiant
      ? "rgba(0, 124, 0, 0.3)"
      : "rgba(219, 0, 0, 0.3)",
  });

  const getLabelStyle = (isRadiant) => ({
    backgroundColor: isRadiant ? "#1b2314" : "#240f0e",
    boxShadow: isRadiant ? "0 2px 5px #1b2314" : "0 4px 5px #240f0e",
  });

  return (
    <div className={styles.container}>
      <h2>{match.didRadiantWin ? "Radiant win!" : "Dire win!"}</h2>
      <div className={styles.marker}>
        <h3>{match.radiantKills.reduce((sum, kills) => sum + kills, 0)}</h3>
        <h3>
          {Math.floor(match.durationSeconds / 60)}:{match.durationSeconds % 60}
        </h3>
        <h3>{match.direKills.reduce((sum, kills) => sum + kills, 0)}</h3>
      </div>
      <div className={styles.teams}>
        {renderPlayers(
          match.players.filter((p) => p.isRadiant),
          true
        )}
        {renderPlayers(
          match.players.filter((p) => !p.isRadiant),
          false
        )}
      </div>
    </div>
  );
};

export default MatchDisplay;
