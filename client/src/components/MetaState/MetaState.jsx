import React from "react";
import styles from "./MetaState.module.css";

const MetaState = ({ metaData }) => {
  const getPositionName = (positionId) => {
    switch (positionId) {
      case 1:
        return "Carry (Position 1)";
      case 2:
        return "Midlaner (Position 2)";
      case 3:
        return "Offlaner (Position 3)";
      case 4:
        return "Soft Support (Position 4)";
      case 5:
        return "Hard Support (Position 5)";
      default:
        return "Unknown";
    }
  };

  const getHeroImage = (shortName) => {
    return `https://cdn.stratz.com/images/dota2/heroes/${shortName}_vert.png`;
  };

  return (
    <div className={styles.metaBlock}>
      <h3 className={styles.title}>State of the Meta</h3>

      <div className={styles.positionsWrapper}>
        {[1, 2, 3, 4, 5].map((positionId) => {
          const bestHero = metaData.find(
            (hero) => hero.position_id === positionId
          );

          if (!bestHero) return null;

          const winrate = (bestHero.win_count / bestHero.match_count) * 100;

          return (
            <div key={positionId} className={styles.heroCard}>
              <img
                src={getHeroImage(bestHero.short_name)}
                alt={bestHero.display_name}
                className={styles.heroImage}
              />
              <div className={styles.heroInfo}>
                <h4>{bestHero.display_name}</h4>
                <p>
                  <strong>Position:</strong> {getPositionName(positionId)}
                </p>
                <p>
                  <strong>Winrate:</strong>{" "}
                  <span className={styles.winrate}>{winrate.toFixed(1)}%</span>
                </p>
                <p>
                  <strong>Matches:</strong> {bestHero.match_count}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.note}>
        This card looks at the last 12 days to capture up-to-date meta trends.
      </p>
    </div>
  );
};

export default MetaState;
