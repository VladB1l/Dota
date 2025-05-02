import React, { useState } from "react";
import UiButton from "@/ui/UiButton/UiButton";
import { Link } from "react-router-dom";
import goldIcon from "@images/gold.png";
import BestSupportIcon from "@icons/BestSupportIcon";
import BestCoreIcon from "@icons/BestCoreIcon";
import BestPlayerIcon from "@icons/BestPlayerIcon";
import Pos1Icon from "@icons/Pos1Icon";
import Pos2Icon from "@icons/Pos2Icon";
import Pos3Icon from "@icons/Pos3Icon";
import Pos4Icon from "@icons/Pos4Icon";
import Pos5Icon from "@icons/Pos5Icon";
import styles from "./MatchDisplay.module.css";

const MatchDisplay = ({ match }) => {
  const [showFull, setShowFull] = useState(false);

  const toggleStats = () => setShowFull((prev) => !prev);

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

  const renderPlayersShort = (team, isRadiant) => (
    <div
      className={`${styles.team} ${styles.shortTeams}`}
      style={getTeamStyle(isRadiant)}
    >
      <h3 className={styles.label} style={getLabelStyle(isRadiant)}>
        {isRadiant ? "Radiant" : "Dire"}
      </h3>
      {team.map((player, idx) => (
        <Link
          to={`/player/${player.steamAccount.id}`}
          key={idx}
          className={styles.player}
        >
          <img
            src={`https://cdn.stratz.com/images/dota2/heroes/${player.hero.shortName}_icon.png`}
            alt={player.hero.displayName}
          />
          <p>{player.steamAccount?.name || "Unknown"}</p>
          <div
            className={styles.kda}
          >{`${player.kills} / ${player.deaths} / ${player.assists}`}</div>
          <div className={styles.rankWrapper}>
            <img
              src={`https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${Math.floor(
                player.steamAccount.seasonRank / 10
              )}.png`}
              className={styles.medal}
              alt="Medal"
            />
            {player.steamAccount.seasonRank % 10 !== 0 && (
              <img
                src={`https://cdn.stratz.com/images/dota2/seasonal_rank/star_${
                  player.steamAccount.seasonRank % 10
                }.png`}
                className={styles.star}
                alt="Star"
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  const renderPlayersFull = (team, isRadiant) => (
    <div
      className={`${styles.team} ${styles.longTeams}`}
      style={getTeamStyle(isRadiant)}
    >
      <h3 className={styles.label} style={getLabelStyle(isRadiant)}>
        {isRadiant ? "Radiant" : "Dire"}
      </h3>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContent}>
          <div className={styles.fullStatsHeader}>
            <div className={styles.colHero}>Hero</div>
            <div className={styles.colRole}>Role</div>
            <div className={styles.colName}>Name</div>
            <div className={styles.colRank}>Rank</div>
            <div className={styles.colKda}>K/D/A</div>
            <div className={styles.colAward}>Award</div>
            <div className={styles.colNet}>NW</div>
            <div className={styles.colLvl}>Lvl</div>
            <div className={styles.colGpm}>GPM</div>
            <div className={styles.colXpm}>XPM</div>
            <div className={styles.colHd}>HDmg</div>
            <div className={styles.colTd}>TDmg</div>
            <div className={styles.colHeal}>Heal</div>
          </div>

          {team.map((p, i) => {
            const { icon: posIcon } = getRoleInfo(p.position);
            const awardIcon = getAwardIcon(p.award);
            const medal = Math.floor(p.steamAccount.seasonRank / 10);
            const star = p.steamAccount.seasonRank % 10;
            const medalUrl = `https://cdn.stratz.com/images/dota2/seasonal_rank/medal_${medal}.png`;
            const starUrl = `https://cdn.stratz.com/images/dota2/seasonal_rank/star_${star}.png`;

            return (
              <Link
                to={`/player/${p.steamAccount.id}`}
                key={i}
                className={styles.fullStatsRow}
              >
                <div className={styles.colHero}>
                  <img
                    src={`https://cdn.stratz.com/images/dota2/heroes/${p.hero.shortName}_horz.png`}
                    alt={p.hero.displayName}
                    className={styles.smallIcon}
                  />
                </div>

                <div className={styles.colRole}>{posIcon}</div>

                <div className={styles.colName}>
                  {p.steamAccount?.name || "Unknown"}
                </div>

                <div className={styles.colRank}>
                  <div className={styles.rankWrapper}>
                    <img src={medalUrl} className={styles.medal} alt="Medal" />
                    {star !== 0 && (
                      <img src={starUrl} className={styles.star} alt="Star" />
                    )}
                  </div>
                </div>

                <div
                  className={styles.colKda}
                >{`${p.kills}/${p.deaths}/${p.assists}`}</div>

                <div className={styles.colAward}>{awardIcon}</div>

                <div className={styles.colNet}>
                  <img src={goldIcon} alt="Gold" className={styles.goldIcon} />

                  {p.computedNetworth?.toLocaleString()}
                </div>

                <div className={styles.colLvl}>{p.computedLevel}</div>
                <div className={styles.colGpm}>{p.goldPerMinute}</div>
                <div className={styles.colXpm}>{p.experiencePerMinute}</div>
                <div className={styles.colHd}>
                  {p.heroDamage.toLocaleString()}
                </div>
                <div className={styles.colTd}>
                  {p.towerDamage.toLocaleString()}
                </div>
                <div className={styles.colHeal}>
                  {p.heroHealing.toLocaleString()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  const getTeamStyle = (isRadiant) => ({
    backgroundColor: isRadiant ? "rgba(0,124,0,0.3)" : "rgba(219,0,0,0.3)",
  });

  const getLabelStyle = (isRadiant) => ({
    backgroundColor: isRadiant ? "#587341" : "#823633",
    boxShadow: isRadiant ? "0 2px 5px #587341" : "0 4px 3px #823633",
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {match.didRadiantWin ? "Radiant win" : "Dire win"}
      </h2>
      <div className={styles.timeDuration}>
        <h3>{match.radiantKills.reduce((s, k) => s + k, 0)}</h3>
        <h3>
          {Math.floor(match.durationSeconds / 60)}:
          {String(match.durationSeconds % 60).padStart(2, "0")}
        </h3>
        <h3>{match.direKills.reduce((s, k) => s + k, 0)}</h3>
      </div>

      <UiButton
        text={showFull ? "Show Short Stats" : "Show Full Stats"}
        onClick={toggleStats}
        type="submit"
      />

      <div className={styles.teams}>
        {!showFull
          ? renderPlayersShort(
              match.players.filter((p) => p.isRadiant),
              true
            )
          : renderPlayersFull(
              match.players.filter((p) => p.isRadiant),
              true
            )}
        {!showFull
          ? renderPlayersShort(
              match.players.filter((p) => !p.isRadiant),
              false
            )
          : renderPlayersFull(
              match.players.filter((p) => !p.isRadiant),
              false
            )}
      </div>
    </div>
  );
};

export default MatchDisplay;
