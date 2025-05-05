import React from "react";
import { getTeamStyle, getLabelStyle } from "@ui/matchUtils";
import styles from "./OptimizedPicks.module.css";

const OptimizedPicks = ({ optimization }) => {
  const renderTeam = (
    teamDetails,
    originalWinrate,
    optimizedWinrate,
    label
  ) => {
    const isRadiant = label === "Radiant";

    return (
      <div className={styles.teamBlock} style={getTeamStyle(isRadiant)}>
        <h3 className={styles.label} style={getLabelStyle(isRadiant)}>
          {label}
        </h3>
        <p className={styles.winrate}>
          Original:{" "}
          <span className={styles.original}>{originalWinrate.toFixed(2)}%</span>{" "}
          Optimized:{" "}
          <span className={styles.optimized}>
            {optimizedWinrate.toFixed(2)}%
          </span>
        </p>
        <div className={styles.heroes}>
          {teamDetails.map((hero, idx) => (
            <div key={idx} className={styles.hero}>
              <img
                src={`https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_horz.png`}
                alt={hero.displayName}
              />
              <p>{hero.displayName}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Optimized picks</h2>
      <div className={styles.picksWrapper}>
        {renderTeam(
          optimization.optimizedRadiantDetails,
          optimization.radiantWinChanceOriginal,
          optimization.radiantWinChanceOptimized,
          "Radiant"
        )}
        {renderTeam(
          optimization.optimizedDireDetails,
          optimization.direWinChanceOriginal,
          optimization.direWinChanceOptimized,
          "Dire"
        )}
      </div>
    </div>
  );
};

export default OptimizedPicks;
