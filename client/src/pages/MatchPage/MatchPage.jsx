import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { xpTable } from "@ui/matchUtils";
import MatchDisplay from "@components/MatchDisplay/MatchDisplay";
import MatchReportGenerator from "@ui/MatchReportGenerator/MatchReportGenerator";
import OptimizedPicks from "@components/OptimizedPicks/OptimizedPicks";
import UiButton from "@/ui/UiButton/UiButton";
import SwordIcon from "@icons/SwordIcon";
import TitleCard from "@components/TitleCard/TitleCard";
import AccordionBlock from "@ui/AccordionBlock/AccordionBlock";
import RuneStats from "@components/RuneStats/RuneStats";
import StackStats from "@components/StackStats/StackStats";
import WardStats from "@components/WardStats/WardStats";
import LaneStats from "@components/LaneStats/LaneStats";
// import LeadStats from "@components/LeadStats/LeadStats";

import styles from "./MatchPage.module.css";

const MatchPage = ({ currentUser }) => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [loadingOpt, setLoadingOpt] = useState(false);

  const runeStatsRef = useRef();
  const wardStatsRef = useRef();
  const stackStatsRef = useRef();
  const laneStatsRef = useRef();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch("http://localhost:4000/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId: id }),
        });
        const data = await res.json();

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
      wisdom = { R: 0, D: 0 },
      water = { R: 0, D: 0 };

    match.players.forEach((p) => {
      const team = p.isRadiant ? "R" : "D";

      p.stats.wards.forEach((w) => (w.type === 0 ? obs[team]++ : sen[team]++));

      stacks[team] += Math.max(...p.stats.campStack);

      p.stats.runes.forEach((r) => {
        if (r.rune === "BOUNTY" && r.action === "PICKUP") bounty[team]++;
        if (r.rune === "WISDOM" && r.action === "PICKUP") wisdom[team]++;
        if (r.rune === "WATER" && r.action === "PICKUP") water[team]++;
      });
    });

    setAnalysis({
      obs,
      sen,
      stacks,
      bounty,
      wisdom,
      water,
    });
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
      <MatchReportGenerator
        match={match}
        analysis={analysis}
        optimization={optimization}
        refs={{
          runeStatsRef,
          stackStatsRef,
          wardStatsRef,
          laneStatsRef,
        }}
      />

      {match && analysis ? (
        <>
          <MatchDisplay match={match} currentUser={currentUser} />

          <AccordionBlock title="Rune Stats">
            <RuneStats ref={runeStatsRef} match={match} analysis={analysis} />
          </AccordionBlock>
          <AccordionBlock title="Stack Stats">
            <StackStats ref={stackStatsRef} match={match} analysis={analysis} />
          </AccordionBlock>
          <AccordionBlock title="Ward Stats">
            <WardStats ref={wardStatsRef} match={match} analysis={analysis} />
          </AccordionBlock>
          <AccordionBlock title="Lane Stats">
            <LaneStats ref={laneStatsRef} match={match} analysis={analysis} />
          </AccordionBlock>

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
