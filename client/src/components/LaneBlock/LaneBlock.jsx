import React from "react";
import styles from "./LaneBlock.module.css";
import { getTeamStyle } from "@ui/matchUtils";
import goldIcon from "@images/gold.png";

const LaneBlock = ({ radiant, dire }) => {
  const renderPlayer = (player, isRadiant) => {
    if (!player) return null;
    return (
      <div
        className={`${styles.block} ${
          isRadiant ? styles.radiant : styles.dire
        }`}
        style={getTeamStyle(isRadiant)}
      >
        <img
          src={`https://cdn.stratz.com/images/dota2/heroes/${player.hero}_horz.png`}
          alt="Hero"
          className={styles.heroImg}
        />
        <div className={styles.info}>
          <div className={styles.name}>{player.name}</div>
          <div className={styles.row}>
            <img src={goldIcon} alt="Gold" className={styles.icon} />
            {player.networth} · Lvl {player.level}
          </div>
          <div className={styles.row}>
            KDA: {player.kills}/{player.deaths}/{player.assists} · LH:{" "}
            {player.lastHits} · DN: {player.denies}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.laneWrapper}>
      <div className={styles.rowWrapper}>
        {renderPlayer(radiant, true)}
        {renderPlayer(dire, false)}
      </div>
    </div>
  );
};

export default LaneBlock;
