import React from "react";
import { Link } from "react-router-dom";
import goldIcon from "@images/gold.png";
import {
  getRoleInfo,
  getTeamStyle,
  getLabelStyle,
  getAwardIcon,
} from "@ui/matchUtils";

import styles from "@components/MatchDisplay/MatchDisplay.module.css";

const PlayersFullStats = ({ team, isRadiant }) => (
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
              <div className={styles.colKda}>
                {`${p.kills}/${p.deaths}/${p.assists}`}
              </div>
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

export default PlayersFullStats;
