import React from "react";
import { forwardRef, useImperativeHandle } from "react";
import LaneBlock from "@components/LaneBlock/LaneBlock";
import { xpTable } from "@ui/matchUtils";
import styles from "./LaneStats.module.css";

const getKDAUpToMinute = (player, seconds = 600) => {
  const kills = player.stats.killEvents.filter((e) => e.time <= seconds).length;
  const deaths = player.stats.deathEvents.filter(
    (e) => e.time <= seconds
  ).length;
  const assists = player.stats.assistEvents.filter(
    (e) => e.time <= seconds
  ).length;
  return { kills, deaths, assists };
};

const getLastHitsAndDenies = (player, upToMinute = 10) => {
  const lh =
    player.stats.lastHitsPerMinute
      ?.slice(0, upToMinute)
      .reduce((a, b) => a + b, 0) || 0;
  const dn =
    player.stats.deniesPerMinute
      ?.slice(0, upToMinute)
      .reduce((a, b) => a + b, 0) || 0;
  return { lastHits: lh, denies: dn };
};

const getXpAndNetworth = (player, upToMinute = 10) => {
  const xpSum =
    player.stats.experiencePerMinute
      ?.slice(0, upToMinute)
      .reduce((a, b) => a + b, 0) || 0;
  const levelIndex = xpTable.findIndex((xp) => xp > xpSum);
  const level = levelIndex === -1 ? 30 : levelIndex;
  const networth = player.stats.networthPerMinute?.[10] || 0;
  return { level, networth };
};

const calculateWinner = (radiant, dire) => {
  const sumStats = (players) =>
    players.reduce(
      (acc, p) => {
        acc.kda += p.kills + p.assists;
        acc.lh += p.lastHits;
        acc.dn += p.denies;
        return acc;
      },
      { kda: 0, lh: 0, dn: 0 }
    );

  const r = sumStats(radiant);
  const d = sumStats(dire);
  const rScore = r.kda + r.lh + r.dn;
  const dScore = d.kda + d.lh + d.dn;

  if (Math.abs(rScore - dScore) < 5) return "Tie";
  return rScore > dScore ? "Radiant" : "Dire";
};

const getSummary = (label, radiant, dire, winner) => {
  const sumStats = (players) =>
    players.reduce(
      (acc, p) => {
        acc.kda += p.kills + p.assists;
        acc.lh += p.lastHits;
        acc.dn += p.denies;
        return acc;
      },
      { kda: 0, lh: 0, dn: 0 }
    );

  const r = sumStats(radiant);
  const d = sumStats(dire);

  const kdaDiff = Math.abs(r.kda - d.kda);
  const lhDiff = Math.abs(r.lh - d.lh);

  if (winner === "Tie") {
    return `The ${label} ended in a tie, with no significant lead in kills or last hits.`;
  }

  if (kdaDiff >= 5 && lhDiff >= 10) {
    return `${winner} completely dominated the ${label} with superior fighting and farming.`;
  }
  if (kdaDiff >= 5) {
    return `${winner} won the ${label} mainly through kill participation.`;
  }
  if (lhDiff >= 10) {
    return `${winner} gained the upper hand on the ${label} through better farming.`;
  }
  return `${winner} slightly edged out on the ${label}, with small advantages.`;
};

const getLaningPhaseSummary = (match, lanes) => {
  const netLead = match.radiantNetworthLeads[9];
  const xpLead = match.radiantExperienceLeads[9];
  const gameDuration = match.durationSeconds;

  const winningSide =
    Math.abs(netLead) <= 2000 ? null : netLead > 0 ? "Radiant" : "Dire";

  const laneResults = Object.values(lanes).map((lane) =>
    calculateWinner(lane.radiant, lane.dire)
  );
  const radiantWins = laneResults.filter((r) => r === "Radiant").length;
  const direWins = laneResults.filter((r) => r === "Dire").length;

  let leadSummary = `By the end of the laning phase, ${
    netLead > 0 ? "Radiant" : "Dire"
  } had a networth lead of ${Math.abs(netLead)} gold and ${
    xpLead > 0 ? "Radiant" : "Dire"
  } had an experience lead of ${Math.abs(xpLead)} XP.`;

  if (!winningSide) {
    return `${leadSummary} The laning phase was relatively balanced, with no side gaining a decisive networth lead.`;
  }

  const winningLanes = winningSide === "Radiant" ? radiantWins : direWins;

  if (winningLanes >= 2 && gameDuration <= 2100) {
    return `${leadSummary} ${winningSide} won most of their lanes and secured a strong laning phase advantage, which directly impacted the game's outcome as they closed the game within 35 minutes.`;
  }

  if (winningLanes >= 2) {
    return `${leadSummary} ${winningSide} dominated the laning phase by winning most lanes and securing an early networth advantage.`;
  }

  return `${leadSummary} ${winningSide} managed to get ahead in networth by 10 minutes, although lane outcomes were more evenly split.`;
};

const LaneStats = forwardRef(({ match }, ref) => {
  const lanes = {
    TOP: { radiant: [], dire: [], label: "Top Lane" },
    MID: { radiant: [], dire: [], label: "Mid Lane" },
    BOTTOM: { radiant: [], dire: [], label: "Bottom Lane" },
  };

  match.players.forEach((player) => {
    const side = player.isRadiant ? "radiant" : "dire";
    const kda = getKDAUpToMinute(player);
    const lhDn = getLastHitsAndDenies(player);
    const xpGold = getXpAndNetworth(player);

    const playerInfo = {
      hero: player.hero.shortName,
      name: player.steamAccount?.name || "Unknown",
      networth: xpGold.networth,
      level: xpGold.level,
      kills: kda.kills,
      deaths: kda.deaths,
      assists: kda.assists,
      lastHits: lhDn.lastHits,
      denies: lhDn.denies,
      isRadiant: player.isRadiant,
    };

    if (player.lane === "OFF_LANE") {
      if (player.isRadiant) lanes.TOP.radiant.push(playerInfo);
      else lanes.BOTTOM.dire.push(playerInfo);
    } else if (player.lane === "SAFE_LANE") {
      if (player.isRadiant) lanes.BOTTOM.radiant.push(playerInfo);
      else lanes.TOP.dire.push(playerInfo);
    } else if (player.lane === "MID_LANE") {
      lanes.MID[side].push(playerInfo);
    }
  });

  const laningSummary = getLaningPhaseSummary(match, lanes);

  useImperativeHandle(ref, () => ({
    getData: () => {
      if (!lanes)
        return { title: "Lane Stats", content: ["No lane data available."] };

      const laneSections = Object.entries(lanes).map(([key, lane]) => {
        if (!lane.radiant || !lane.dire) return [`${key} — data missing.`];

        const winner = calculateWinner(lane.radiant, lane.dire);
        const lines = [];

        lines.push(`${lane.label} — Winner: ${winner}`);

        if (lane.radiant.length > 0) {
          lines.push(`Radiant:`);
          lane.radiant.forEach((p) => {
            lines.push(
              `- ${p.name} (${p.hero}) — K/D/A: ${p.kills}/${p.deaths}/${p.assists}, LH/DN: ${p.lastHits}/${p.denies}, NW: ${p.networth}, Lvl: ${p.level}`
            );
          });
        }

        if (lane.dire.length > 0) {
          lines.push(`Dire:`);
          lane.dire.forEach((p) => {
            lines.push(
              `- ${p.name} (${p.hero}) — K/D/A: ${p.kills}/${p.deaths}/${p.assists}, LH/DN: ${p.lastHits}/${p.denies}, NW: ${p.networth}, Lvl: ${p.level}`
            );
          });
        }

        lines.push(
          `Summary: ${getSummary(lane.label, lane.radiant, lane.dire, winner)}`
        );
        lines.push("");

        return lines;
      });

      return {
        title: "Lane Stats",
        content: [
          ...laneSections.flat(),
          "Overall Laning Summary:",
          laningSummary,
        ],
      };
    },
  }));

  return (
    <div className={styles.laneStatsWrapper}>
      <p className={styles.note}>
        The following statistics are collected during the first 10 minutes of
        the match, representing the laning phase.
      </p>
      {Object.entries(lanes).map(([key, lane]) => {
        const winner = calculateWinner(lane.radiant, lane.dire);
        return (
          <div key={key}>
            <h3 className={styles.laneTitle}>
              {lane.label} – Winner: {winner}
            </h3>

            {lane.radiant.map((rPlayer, i) => (
              <LaneBlock
                key={`lane-${key}-${i}`}
                lane={lane.label}
                radiant={rPlayer}
                dire={lane.dire[i]}
              />
            ))}
            {lane.radiant.length < lane.dire.length &&
              lane.dire
                .slice(lane.radiant.length)
                .map((dPlayer, i) => (
                  <LaneBlock
                    key={`lane-${key}-extra-${i}`}
                    lane={lane.label}
                    radiant={null}
                    dire={dPlayer}
                  />
                ))}

            <p className={styles.summaryText}>
              {getSummary(lane.label, lane.radiant, lane.dire, winner)}
            </p>
          </div>
        );
      })}
      <h3 className={styles.laneTitle}>Laning Summary</h3>
      <p className={styles.leadSummaryText}>{laningSummary}</p>
    </div>
  );
});

export default LaneStats;
