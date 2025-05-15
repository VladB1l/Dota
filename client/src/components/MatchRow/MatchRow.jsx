import React from "react";
import { Link } from "react-router-dom";
import { getRoleInfo, getAwardIcon, formatDate } from "@ui/matchUtils";
import StarIcon from "@icons/StarIcon";
import styles from "./MatchRow.module.css";

const MatchRow = ({
  match,
  player,
  heroShortName,
  isFavorite,
  onToggleFavorite,
}) => {
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

  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    onToggleFavorite?.(match.id);
  };

  return (
    <Link to={`/match/${match.id}`} className={styles.linkWrapper}>
      <div className={styles.matchRow}>
        <div>
          <button
            onClick={handleFavoriteClick}
            className={styles.favoriteButton}
          >
            <StarIcon
              className={isFavorite ? styles.starIconActive : styles.starIcon}
              size={30}
            />
          </button>

          <img
            src={`https://cdn.stratz.com/images/dota2/heroes/${heroShortName}_horz.png`}
            className={styles.heroImage}
            alt="Hero"
          />

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
