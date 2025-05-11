import React from "react";
import { forwardRef, useImperativeHandle } from "react";
import bountyIcon from "@images/BountyRuneIcon.webp";
import waterIcon from "@images/WaterRuneIcon.webp";
import wisdomIcon from "@images/WisdomRuneIcon.webp";
import styles from "./RuneStats.module.css";

const RuneStats = forwardRef(({ analysis }, ref) => {
  const buildRuneBlock = (
    icon,
    label,
    radiantCount,
    direCount,
    analysisText
  ) => (
    <div className={styles.runeBlock}>
      <div className={styles.counts}>
        <div className={styles.countBlock}>
          <span>Radiant</span>
          <span>{radiantCount}</span>
        </div>
        <div className={styles.iconBlock}>
          <img src={icon} alt={label} className={styles.runeIcon} />
        </div>
        <div className={styles.countBlock}>
          <span>Dire</span>
          <span>{direCount}</span>
        </div>
      </div>
      <div className={styles.analysisText}>{analysisText}</div>
    </div>
  );

  const bountyText =
    analysis.bounty.R > analysis.bounty.D
      ? `Radiant picked up more Bounty Runes, giving them a consistent economic edge in the early game.`
      : analysis.bounty.D > analysis.bounty.R
      ? `Dire controlled more Bounty Runes, possibly gaining an advantage in gold income.`
      : `Both teams picked up an equal number of Bounty Runes, leading to balanced early-game economy.`;

  const waterText =
    analysis.water?.R > analysis.water?.D
      ? `Radiant secured more Water Runes, granting better sustain to their midlaner and improving laning potential.`
      : analysis.water?.D > analysis.water?.R
      ? `Dire midlaner had better access to Water Runes, providing superior lane sustain.`
      : `Water Runes were equally shared, giving no side clear midlane sustain advantage.`;

  const wisdomText =
    analysis.wisdom.R > analysis.wisdom.D
      ? `Radiant gained more Wisdom Runes, accelerating their support levels.`
      : analysis.wisdom.D > analysis.wisdom.R
      ? `Dire had better control over Wisdom Runes, giving supports an experience boost.`
      : `Wisdom Rune pickups were even, meaning no team had a level advantage from runes.`;

  useImperativeHandle(ref, () => ({
    getData: () => {
      return {
        title: "Rune Stats",
        content: [
          `Bounty Runes — Radiant: ${analysis.bounty.R}, Dire: ${analysis.bounty.D}`,
          `Water Runes — Radiant: ${analysis.water.R}, Dire: ${analysis.water.D}`,
          `Wisdom Runes — Radiant: ${analysis.wisdom.R}, Dire: ${analysis.wisdom.D}`,
          "",
          `Analysis:`,
          `Bounty Rune Analysis: ${bountyText}`,
          `Water Rune Analysis: ${waterText}`,
          `Wisdom Rune Analysis: ${wisdomText}`,
        ],
      };
    },
  }));

  return (
    <div className={styles.container}>
      {buildRuneBlock(
        bountyIcon,
        "Bounty Rune",
        analysis.bounty.R,
        analysis.bounty.D,
        bountyText
      )}
      {buildRuneBlock(
        waterIcon,
        "Water Rune",
        analysis.water.R,
        analysis.water.D,
        waterText
      )}
      {buildRuneBlock(
        wisdomIcon,
        "Wisdom Rune",
        analysis.wisdom.R,
        analysis.wisdom.D,
        wisdomText
      )}
    </div>
  );
});

export default RuneStats;
