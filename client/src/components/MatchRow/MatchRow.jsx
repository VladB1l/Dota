import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRoleInfo, getAwardIcon, formatDate } from "@ui/matchUtils";
import StarIcon from "@icons/StarIcon";
import styles from "./MatchRow.module.css";

const MatchRow = ({
  match,
  player,
  heroShortName,
  isFavorite,
  onToggleFavorite,
  currentUser,
}) => {
  const [note, setNote] = useState("");
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/match/${match.id}`);
  };

  useEffect(() => {
    if (!currentUser) return;
    fetch(
      `http://localhost:4000/match-notes/${currentUser.steamId32}/${match.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.note) {
          setNote(data.note);
          setInputValue(data.note);
        } else {
          setNote("");
          setInputValue("");
        }
      });
  }, [currentUser, match.id]);

  const handleSaveNote = async () => {
    if (!currentUser) return;
    if (inputValue.length > 15)
      return alert("Note must be under 15 characters.");

    await fetch("http://localhost:4000/match-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.steamId32,
        matchId: match.id,
        note: inputValue,
      }),
    });

    setNote(inputValue);
  };

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
    <div className={styles.linkWrapper} onClick={handleRowClick}>
      <div className={styles.matchRow}>
        <div>
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleFavoriteClick}
              className={styles.favoriteButton}
            >
              <StarIcon
                className={isFavorite ? styles.starIconActive : styles.starIcon}
                size={30}
              />
            </button>
          </div>
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

        {currentUser && (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              className={styles.noteInput}
              type="text"
              maxLength={20}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="Add note..."
            />
          </div>
        )}
        {note && !currentUser && (
          <div className={styles.noteDisplay}>Note: {note}</div>
        )}

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
    </div>
  );
};

export default MatchRow;
