import React from "react";
import { Link } from "react-router-dom";
import { getTeamStyle, getLabelStyle } from "@ui/matchUtils";
import styles from "@components/MatchDisplay/MatchDisplay.module.css";

const PlayersShortStats = ({ team, isRadiant }) => (
  <div
    className={`${styles.team} ${styles.shortTeams}`}
    style={getTeamStyle(isRadiant)}
  >
    <h3 className={styles.label} style={getLabelStyle(isRadiant)}>
      {isRadiant ? "Radiant" : "Dire"}
    </h3>
    {team.map((player, idx) => (
      <Link
        to={`/player/${player.steamAccount.id}`}
        key={idx}
        className={styles.player}
      >
        <img
          src={`https://cdn.stratz.com/images/dota2/heroes/${player.hero.shortName}_icon.png`}
          alt={player.hero.displayName}
        />
        <p>{player.steamAccount?.name || "Unknown"}</p>
        <div className={styles.kda}>
          {`${player.kills} / ${player.deaths} / ${player.assists}`}
        </div>
        <div className={styles.rankWrapper}>
          <img
            src={`https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${Math.floor(
              player.steamAccount.seasonRank / 10
            )}.png`}
            className={styles.medal}
            alt="Medal"
          />
          {player.steamAccount.seasonRank % 10 !== 0 && (
            <img
              src={`https://cdn.stratz.com/images/dota2/seasonal_rank/star_${
                player.steamAccount.seasonRank % 10
              }.png`}
              className={styles.star}
              alt="Star"
            />
          )}
        </div>
      </Link>
    ))}
  </div>
);

export default PlayersShortStats;
