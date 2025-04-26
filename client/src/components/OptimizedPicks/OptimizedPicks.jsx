import React from "react";
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
      <h2>Optimized picks</h2>
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
