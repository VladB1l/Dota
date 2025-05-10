import React from "react";
import observerIcon from "@images/WardObserverIcon.webp";
import sentryIcon from "@images/WardSentryIcon.webp";
import styles from "./WardStats.module.css";

const WardStats = ({ analysis, match }) => {
  const matchMinutes = Math.floor(match.durationSeconds / 60);


  const initialStock = 2;
  const restockTime = 135;
  const maxObsWards =
    initialStock + Math.floor(match.durationSeconds / restockTime);

  const observerResult = [];
  const sentryResult = [];

  const observerLifetimes = { R: [], D: [] };
  const observerDestroyed = { R: 0, D: 0 };

  match.players.forEach((player) => {
    const team = player.isRadiant ? "R" : "D";

    const observerWards = player.stats.wards.filter((w) => w.type === 0);

    observerWards.forEach((ward) => {
      const placedAt = ward.time;
      const destroyedByEnemy = match.players
        .filter((p) => p.isRadiant !== player.isRadiant)
        .some((enemy) =>
          enemy.stats.wards.some(
            (w) =>
              w.type === 1 &&
              Math.hypot(
                w.positionX - ward.positionX,
                w.positionY - ward.positionY
              ) <= 1000 &&
              Math.abs(w.time - ward.time) <= 240
          )
        );

      const lifetime = destroyedByEnemy
        ? Math.min(360, match.durationSeconds - placedAt)
        : Math.min(360, match.durationSeconds - placedAt);

      observerLifetimes[team].push(lifetime);
      if (destroyedByEnemy) observerDestroyed[team]++;
    });
  });

  const observerAnalysis = (teamKey, label) => {
    const count = analysis.obs[teamKey];
    const missed = maxObsWards - count;

    if (missed >= 4) {
      observerResult.push({
        text: `${label} missed ${missed} observer wards — critical vision error.`,
        type: "critical",
      });
    } else if (missed > 0) {
      observerResult.push({
        text: `${label} missed ${missed} observer wards — should ward more.`,
        type: "warning",
      });
    } else {
      observerResult.push({
        text: `${label} placed maximum observer wards.`,
        type: "good",
      });
    }
  };

  observerAnalysis("R", "Radiant");
  observerAnalysis("D", "Dire");

  const totalLifetimeR = observerLifetimes.R.reduce((a, b) => a + b, 0);
  const totalLifetimeD = observerLifetimes.D.reduce((a, b) => a + b, 0);
  const lifetimeDiff = totalLifetimeR - totalLifetimeD;
  const destroyedDiff = observerDestroyed.R - observerDestroyed.D;

  const summaryText = `During the post-match analysis, it was observed that warding strategies had a noticeable impact on the game. ${
    lifetimeDiff > 10
      ? `Radiant maintained longer observer ward uptime — totaling ${Math.abs(
          lifetimeDiff
        )} seconds more than Dire — providing better map control and vision. `
      : lifetimeDiff < -10
      ? `Dire observer wards outlived Radiant's by ${Math.abs(
          lifetimeDiff
        )} seconds in total, indicating better ward placement or fewer deward attempts. `
      : `Both teams had similar observer uptime, suggesting relatively equal vision presence. `
  }${
    destroyedDiff > 1
      ? `Additionally, Radiant removed ${Math.abs(
          destroyedDiff
        )} more enemy observer wards than Dire, highlighting effective vision denial. `
      : destroyedDiff < -1
      ? `Dire removed ${Math.abs(
          destroyedDiff
        )} more observer wards than Radiant, giving them a slight edge in dewarding. `
      : `Dewarding was evenly matched between both sides. `
  }This combination of uptime and vision denial shows how vision contributed to each team's strategic awareness.`;

  return (
    <div className={styles.container}>
      <div className={styles.iconRow}>
        <div className={styles.iconGroup}>
          <img src={observerIcon} alt="Observer Ward" className={styles.icon} />
          <span>Observer Wards</span>
        </div>
        <div className={styles.iconGroup}>
          <img src={sentryIcon} alt="Sentry Ward" className={styles.icon} />
          <span>Sentry Wards</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        <p>
          <strong>Radiant:</strong> {analysis.obs.R} observers /{" "}
          {analysis.sen.R} sentries
        </p>
        <p>
          <strong>Dire:</strong> {analysis.obs.D} observers / {analysis.sen.D}{" "}
          sentries
        </p>
        <p>
          <strong>Match duration:</strong> {matchMinutes} minutes (max{" "}
          {maxObsWards} observer wards)
        </p>
      </div>

      <div className={styles.conclusion}>
        {[...observerResult, ...sentryResult].map((line, idx) => (
          <p
            key={idx}
            className={`${styles.line} ${
              line.type === "critical"
                ? styles.critical
                : line.type === "warning"
                ? styles.warning
                : styles.good
            }`}
          >
            {line.text}
          </p>
        ))}
        <p className={styles.summaryText}>{summaryText}</p>
      </div>
    </div>
  );
};

export default WardStats;
