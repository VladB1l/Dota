import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchDisplay from "@components/MatchDisplay/MatchDisplay";
import OptimizedPicks from "@components/OptimizedPicks/OptimizedPicks";
import UiButton from "@/ui/UiButton/UiButton";
import SwordIcon from "@icons/SwordIcon";
import TitleCard from "@components/TitleCard/TitleCard";
import styles from "./MatchPage.module.css";

const xpTable = [
  0, 230, 600, 1080, 1665, 2360, 3160, 4060, 5060, 6160, 7360, 8660, 10060,
  11560, 13160, 14860, 16660, 18560, 20560, 22660, 24860, 27160, 29560, 32060,
  34660, 37360, 40160, 43060, 46060,
];

const MatchPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [loadingOpt, setLoadingOpt] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch("http://localhost:4000/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId: id }),
        });
        const data = await res.json();

        // enrich players with computed level and networth
        const enrichedPlayers = data.match.players.map((player) => {
          const networth = player.stats.goldPerMinute.reduce(
            (a, v) => a + v,
            0
          );
          const xpSum = player.stats.experiencePerMinute.reduce(
            (a, v) => a + v,
            0
          );
          const levelIndex = xpTable.findIndex((xp) => xp > xpSum);
          const level = levelIndex === -1 ? 30 : levelIndex;

          return {
            ...player,
            computedNetworth: networth,
            computedLevel: level,
          };
        });

        setMatch({ ...data.match, players: enrichedPlayers });
      } catch (error) {
        console.error("Ошибка при получении матча:", error);
      }
    };

    if (id) fetchMatch();
  }, [id]);

  useEffect(() => {
    if (!match) return;

    const obs = { R: 0, D: 0 },
      sen = { R: 0, D: 0 };
    const stacks = { R: 0, D: 0 };
    const bounty = { R: 0, D: 0 },
      wisdom = { R: 0, D: 0 };

    match.players.forEach((p) => {
      const team = p.isRadiant ? "R" : "D";

      p.stats.wards.forEach((w) => (w.type === 0 ? obs[team]++ : sen[team]++));

      stacks[team] += p.stats.campStack.slice(0, 15).reduce((a, v) => a + v, 0);

      p.stats.runes.forEach((r) => {
        if (r.rune === "BOUNTY" && r.action === "PICKUP") bounty[team]++;
        if (r.rune === "WISDOM" && r.action === "PICKUP") wisdom[team]++;
      });
    });

    const minute = 10,
      idx = minute - 1;
    const netLead = match.radiantNetworthLeads[idx];
    const xpLead = match.radiantExperienceLeads[idx];
    const lanes = ["midLane", "offLane", "safeLane"].map((lane) => {
      const r = match.laneReport.radiant[idx][lane];
      const d = match.laneReport.dire[idx][lane];
      const farmR = r.meleeCount + r.rangeCount + r.siegeCount + r.denyCount;
      const farmD = d.meleeCount + d.rangeCount + d.siegeCount + d.denyCount;
      return {
        lane,
        winner: farmR > farmD ? "Radiant" : farmR < farmD ? "Dire" : "Tie",
      };
    });

    setAnalysis({ obs, sen, stacks, bounty, wisdom, netLead, xpLead, lanes });
  }, [match]);

  const fetchOptimization = async () => {
    if (!match) return;
    setLoadingOpt(true);
    try {
      const res = await fetch("http://localhost:4000/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: match.players }),
      });
      const data = await res.json();
      setOptimization(data);
    } catch (err) {
      console.error("Ошибка при оптимизации:", err);
    } finally {
      setLoadingOpt(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <TitleCard
        title={`Match: ${match?.id || ""}`}
        icon={<SwordIcon className={styles.matchIcon} size={90} />}
        theme="purple"
      />

      {match ? (
        <>
          <MatchDisplay match={match} analysis={analysis} />
          <UiButton
            text={loadingOpt ? "Optimizing..." : "Optimize picks"}
            onClick={fetchOptimization}
            className={styles.optimizeButton}
            type="submit"
            disabled={loadingOpt}
          />
          {loadingOpt && <div className={styles.loader}></div>}
          {optimization && <OptimizedPicks optimization={optimization} />}
        </>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};

export default MatchPage;
