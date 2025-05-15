import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@icons/StarIcon";
import TitleCard from "@/components/TitleCard/TitleCard";
import MatchRow from "@components/MatchRow/MatchRow";
import UiButton from "@/ui/UiButton/UiButton";
import PrivateProfileCard from "@components/PrivateProfileCard/PrivateProfileCard";
import styles from "./PlayerPage.module.css";

const PlayerPage = ({ currentUser }) => {
  const { steamId } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [heroList, setHeroList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteMatchIds, setFavoriteMatchIds] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const matchesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerRes, heroesRes] = await Promise.all([
          fetch(`http://localhost:4000/player/${steamId}`),
          fetch("http://localhost:4000/heroes"),
        ]);

        const playerJson = await playerRes.json();
        const heroesJson = await heroesRes.json();

        setPlayerData(playerJson);
        setHeroList(heroesJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [steamId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const res = await fetch(
          `http://localhost:4000/favorites/${currentUser.steamId32}`,
          {
            credentials: "include",
          }
        );
        const ids = await res.json();
        setFavoriteMatchIds(ids.map((id) => Number(id)));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleToggleFavorite = async (matchId) => {
    if (!currentUser) {
      alert("Please log in to use this function.");
      return;
    }

    const isFav = favoriteMatchIds.includes(matchId);
    const method = isFav ? "DELETE" : "POST";

    try {
      await fetch("http://localhost:4000/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.steamId32, matchId }),
        credentials: "include",
      });

      setFavoriteMatchIds((prev) =>
        isFav
          ? prev.filter((id) => id !== Number(matchId))
          : [...prev, Number(matchId)]
      );
    } catch (err) {
      console.error("Ошибка при изменении избранного:", err);
    }
  };

  const steamAccount = playerData?.steamAccount;
  const allMatches = playerData?.matches || [];
  const filteredMatches = showFavoritesOnly
    ? allMatches.filter((match) => favoriteMatchIds.includes(match.id))
    : allMatches;

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const getShortName = (heroId) => {
    const hero = heroList.find((h) => h.id === heroId);
    return hero ? hero.short_name : "unknown_hero";
  };

  return (
    <div className={styles.profileWrapper}>
      <TitleCard
        title={steamAccount?.name || ""}
        icon={
          steamAccount?.avatar ? (
            <a
              href={`https://steamcommunity.com/profiles/${
                BigInt(playerData?.steamAccountId) + 76561197960265728n
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.avatarLink}
            >
              <img
                className={styles.avatar}
                src={steamAccount.avatar}
                alt={steamAccount.name}
              />
            </a>
          ) : null
        }
        theme="gray"
        isLoading={loading}
      />
      {steamAccount?.isAnonymous ? (
        <PrivateProfileCard />
      ) : (
        <div className={styles.statsWrapper}>
          <div className={styles.statNumberSection}>
            <div className={styles.statNumberBox}>
              <div className={styles.statValue}>
                Win Rate:{" "}
                <span style={{ color: "#587341" }}>
                  {playerData?.winCount && playerData?.matchCount
                    ? `${(
                        (playerData.winCount / playerData.matchCount) *
                        100
                      ).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className={styles.statNumberBox}>
              <div className={styles.statValue}>
                Matches: {playerData?.matchCount || 0} (
                <span style={{ color: "#587341" }}>
                  {playerData?.winCount || 0}
                </span>{" "}
                |
                <span style={{ color: "#823633" }}>
                  {playerData?.matchCount - playerData?.winCount || 0}
                </span>
                )
              </div>
            </div>
          </div>

          <div className={styles.statNumberSection}>
            <div className={styles.statNumberBox}>
              {steamAccount?.seasonRank ? (
                <div className={styles.rankWrapper}>
                  Rank:
                  <div className={styles.rank}>
                    {steamAccount.seasonRank % 10 !== 0 && (
                      <img
                        src={`https://cdn.stratz.com/images/dota2/seasonal_rank/star_${
                          steamAccount.seasonRank % 10
                        }.png`}
                        className={styles.star}
                        alt="Star"
                      />
                    )}
                    <img
                      src={`https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${Math.floor(
                        steamAccount.seasonRank / 10
                      )}.png`}
                      className={styles.medal}
                      alt="Medal"
                    />
                  </div>
                </div>
              ) : (
                "N/A"
              )}
              <div className={styles.countryWrapper}>
                Country:
                {steamAccount?.countryCode ? (
                  <img
                    src={`https://community.fastly.steamstatic.com/public/images/countryflags/${steamAccount.countryCode.toLowerCase()}.gif`}
                    alt="Flag"
                    className={styles.flag}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            <div className={styles.statNumberBox}>
              <div className={styles.statValue}>
                Last Match:{" "}
                {steamAccount?.lastMatchDateTime
                  ? (() => {
                      const date = new Date(
                        steamAccount.lastMatchDateTime * 1000
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = String(date.getFullYear()).slice(-2);
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${day}/${month}/${year} ${hours}:${minutes}`;
                    })()
                  : "N/A"}
              </div>

              <div className={styles.statValue}>
                Smurf: {steamAccount?.smurfFlag ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <div className={styles.matchesBlock}>
            <div className={styles.matchesTitle}>
              <h3>Matches </h3>
              {currentUser && (
                <button
                  className={styles.favoriteButton}
                  onClick={() => {
                    if (!currentUser) {
                      alert("Please log in to use this function.");
                      return;
                    }
                    setShowFavoritesOnly((prev) => !prev);
                  }}
                >
                  <StarIcon
                    className={
                      showFavoritesOnly
                        ? styles.starIconActive
                        : styles.starIcon
                    }
                    size={34}
                  />
                </button>
              )}
            </div>

            <div className={styles.matchRows}>
              <div className={styles.scrollWrapper}>
                <div className={styles.tableHeader}>
                  <div>
                    <div className={styles.colFavorite}></div>
                    <div className={styles.colHero}>Hero</div>
                    <div className={styles.colRole}>Role</div>
                    <div className={styles.colResult}>Result</div>
                    <div className={styles.colKda}>K/D/A</div>
                    <div className={styles.colAward}>Award</div>
                  </div>
                  <div>
                    <div className={styles.colRank}>Rank</div>
                    <div className={styles.colDuration}>Duration</div>
                    <div className={styles.colDate}>Date</div>
                  </div>
                </div>

                <div className={styles.matchTable}>
                  {currentMatches.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      player={match.players[0]}
                      heroShortName={getShortName(match.players[0].heroId)}
                      isFavorite={favoriteMatchIds.includes(match.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.pagination}>
              <UiButton
                text="Prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                type="submit"
                disabled={currentPage === 1}
              />
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <UiButton
                text="Next"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                type="submit"
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
