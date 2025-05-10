import React from "react";
import styles from "./StackStats.module.css";

const StackStats = ({ analysis }) => {
  const result = [];
  const minimumStacks = 5;
  const radiantStacks = analysis.stacks.R;
  const direStacks = analysis.stacks.D;

  if (radiantStacks < minimumStacks) {
    result.push({
      text: `Radiant made only ${radiantStacks} stacks — too few, should aim for more.`,
      type: radiantStacks === 0 ? "critical" : "warning",
    });
  } else {
    result.push({
      text: `Radiant made ${radiantStacks} stacks — good resource management.`,
      type: "good",
    });
  }

  if (direStacks < minimumStacks) {
    result.push({
      text: `Dire made only ${direStacks} stacks — too few, should aim for more.`,
      type: direStacks === 0 ? "critical" : "warning",
    });
  } else {
    result.push({
      text: `Dire made ${direStacks} stacks — good resource management.`,
      type: "good",
    });
  }

  const stackDiff = Math.abs(radiantStacks - direStacks);
  const betterTeam = radiantStacks > direStacks ? "Radiant" : "Dire";

  const summaryText =
    stackDiff < 2
      ? `Both teams performed similarly in stacking jungle camps. No clear advantage gained from stacking.`
      : stackDiff < 5
      ? `${betterTeam} had a slight stacking advantage, potentially resulting in minor farm lead.`
      : `${betterTeam} showed significant stacking effort, which likely translated into better economy and faster item progression.`;

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <p>
          <strong>Radiant stacks:</strong> {radiantStacks}
        </p>
        <p>
          <strong>Dire stacks:</strong> {direStacks}
        </p>
      </div>

      <div className={styles.conclusion}>
        {result.map((line, idx) => (
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

export default StackStats;
