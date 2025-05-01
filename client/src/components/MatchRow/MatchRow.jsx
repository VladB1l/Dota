import React from "react";
import { Link } from "react-router-dom";
import styles from "./MatchRow.module.css";
import BestSupportIcon from "@icons/BestSupportIcon";
import BestCoreIcon from "@icons/BestCoreIcon";
import BestPlayerIcon from "@icons/BestPlayerIcon";
import Pos1Icon from "@icons/Pos1Icon";
import Pos2Icon from "@icons/Pos2Icon";
import Pos3Icon from "@icons/Pos3Icon";
import Pos4Icon from "@icons/Pos4Icon";
import Pos5Icon from "@icons/Pos5Icon";

const getAwardIcon = (award) => {
  switch (award) {
    case "MVP":
      return <BestPlayerIcon size={25} />;
    case "TOP_CORE":
      return <BestCoreIcon size={25} />;
    case "TOP_SUPPORT":
      return <BestSupportIcon size={25} />;
    default:
      return null;
  }
};

const getRoleInfo = (position) => {
  switch (position) {
    case "POSITION_1":
      return { icon: <Pos1Icon size={20} />, name: "Carry" };
    case "POSITION_2":
      return { icon: <Pos2Icon size={20} />, name: "Mid" };
    case "POSITION_3":
      return { icon: <Pos3Icon size={20} />, name: "Off" };
    case "POSITION_4":
      return { icon: <Pos4Icon size={20} />, name: "Pos 4" };
    case "POSITION_5":
      return { icon: <Pos5Icon size={20} />, name: "Pos 5" };
    default:
      return { icon: null, name: "?" };
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const MatchRow = ({ match, player, heroShortName }) => {
  const kda = `${player.kills} / ${player.deaths} / ${player.assists}`;
  const date = formatDate(match.startDateTime);
  const duration = `${Math.floor(match.durationSeconds / 60)}m ${
    match.durationSeconds % 60
  }s`;

  const medal = Math.floor(match.rank / 10);
  const star = match.rank % 10;

  const medalUrl = `https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${medal}.png`;
  const starUrl = `https://cdn.stratz.com/images/dota2/seasonal_rank/star_${star}.png`;

  const { icon: posIcon } = getRoleInfo(player.position);
  const awardIcon = getAwardIcon(player.award);

  return (
    <Link to={`/match/${match.id}`} className={styles.linkWrapper}>
      <div className={styles.matchRow}>
        <div>
          <div className={styles.heroImage}>
            <img
              src={`https://cdn.stratz.com/images/dota2/heroes/${heroShortName}_horz.png`}
              alt="Hero"
            />
          </div>
          <div className={styles.position}>{posIcon}</div>
          <div className={player.isVictory ? styles.victory : styles.defeat}>
            {player.isVictory ? "Win" : "Loss"}
          </div>
          <div className={styles.kda}>{kda}</div>
          <div className={styles.award}>{awardIcon}</div>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.rankWrapper}>
            {star !== 0 && (
              <img src={starUrl} className={styles.star} alt="Star" />
            )}
            <img src={medalUrl} className={styles.medal} alt="Medal" />
          </div>
          <div className={styles.duration}>{duration}</div>
          <div className={styles.date}>{date}</div>
        </div>
      </div>
    </Link>
  );
};

export default MatchRow;
