import React from "react";
import MetaHeroCard from "../MetaHeroCard/MetaHeroCard";
import styles from "./MetaState.module.css";

const MetaState = ({ metaData, isLoading = false }) => {
  const groupedByPosition = [1, 2, 3, 4, 5].map((positionId) => {
    const heroesForPosition = metaData
      .filter((hero) => hero.position_id === positionId)
      .filter((hero) => hero.match_count >= 30)
      .sort(
        (a, b) =>
          (b.win_count / b.match_count) * Math.log(b.match_count) -
          (a.win_count / a.match_count) * Math.log(a.match_count)
      )
      .slice(0, 1);

    return heroesForPosition;
  });

  return (
    <div className={styles.metaBlock}>
      <h3 className={styles.title}>State of the Meta</h3>
      <div className={styles.heroesWrapper}>
        {groupedByPosition.flat().map((hero) => (
          <MetaHeroCard key={hero.hero_id} hero={hero} isLoading={isLoading} />
        ))}
      </div>
      <p className={styles.note}>
        This card looks at the last 12 days to capture up-to-date meta trends.
      </p>
    </div>
  );
};

export default MetaState;
