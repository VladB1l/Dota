import React from "react";
import styles from "./MetaState.module.css";

const MetaState = ({ metaData, heroImages }) => {
  return (
    <div className={styles.metaBlock}>
      <h3 className={styles.title}>State of the Meta</h3>
      <div className={styles.heroes}>
        {metaData.slice(0, 5).map((hero, idx) => (
          <div key={idx} className={styles.heroCard}>
            <img
              src={heroImages[hero.heroId]}
              alt="Hero"
              className={styles.heroImage}
            />
            <p>{((hero.winCount / hero.matchCount) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
      <p className={styles.note}>
        This card looks at the last 12 days to capture up-to-date meta trends
      </p>
    </div>
  );
};

export default MetaState;
