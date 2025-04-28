import React from "react";
import styles from "./MetaHeroCard.module.css";

import Pos1Icon from "@icons/Pos1Icon";
import Pos2Icon from "@icons/Pos2Icon";
import Pos3Icon from "@icons/Pos3Icon";
import Pos4Icon from "@icons/Pos4Icon";
import Pos5Icon from "@icons/Pos5Icon";

const getRoleInfo = (positionId) => {
  switch (positionId) {
    case 1:
      return { icon: <Pos1Icon size={15} />, name: "Carry" };
    case 2:
      return { icon: <Pos2Icon size={15} />, name: "Mid" };
    case 3:
      return { icon: <Pos3Icon size={15} />, name: "Off" };
    case 4:
      return { icon: <Pos4Icon size={15} />, name: "Pos 4" };
    case 5:
      return { icon: <Pos5Icon size={15} />, name: "Pos 5" };
    default:
      return { icon: null, name: "Unknown" };
  }
};

const MetaHeroCard = ({ hero }) => {
  const { icon, name } = getRoleInfo(hero.position_id);

  return (
    <div className={styles.card}>
      <div className={styles.roleTag}>
        {icon}
        {name}
      </div>
      <img
        className={styles.heroImage}
        src={`https://cdn.stratz.com/images/dota2/heroes/${hero.short_name}_horz.png`}
        alt={hero.display_name}
      />
      <div className={styles.heroInfo}>
        <div className={styles.heroName}>{hero.display_name}</div>
        <div className={styles.matches}>Matches: {hero.match_count}</div>
        <div className={styles.winrate}>
          Winrate:{" "}
          <span className={styles.winrateValue}>
            {((hero.win_count / hero.match_count) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetaHeroCard;
