import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchDisplay from "@components/MatchDisplay/MatchDisplay";
import OptimizedPicks from "@components/OptimizedPicks/OptimizedPicks";
import UiButton from "@/ui/UiButton/UiButton";
import styles from "./MatchPage.module.css";

const MatchPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [optimization, setOptimization] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch("http://localhost:4000/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId: id }),
        });
        const data = await res.json();
        if (data.match) {
          setMatch(data.match);
        } else {
          console.error("Матч не найден");
        }
      } catch (error) {
        console.error("Ошибка при получении матча:", error);
      }
    };

    if (id) {
      fetchMatch();
    }
  }, [id]);

  const fetchOptimization = async () => {
    if (!match) return;
    const res = await fetch("http://localhost:4000/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: match.players }),
    });
    const data = await res.json();
    setOptimization(data);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Dota 2 Match Information</h1>

      {match ? (
        <>
          <MatchDisplay match={match} />
          <UiButton
            text="Optimize picks"
            onClick={fetchOptimization}
            type="submit"
          />
          {optimization && <OptimizedPicks optimization={optimization} />}
        </>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};

export default MatchPage;
