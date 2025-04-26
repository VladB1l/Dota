import React, { useState } from "react";
import MatchDisplay from "../components/MatchDisplay/MatchDisplay";
import OptimizedPicks from "../components/OptimizedPicks/OptimizedPicks";
import UiButton from "../ui/UiButton/UiButton";
import UiInput from "../ui/UiInput/UiInput";
import styles from "./MatchPage.module.css";

const MatchPage = () => {
  const [matchId, setMatchId] = useState("");
  const [match, setMatch] = useState(null);
  const [optimization, setOptimization] = useState(null);

  const fetchMatch = async () => {
    const res = await fetch("http://localhost:4000/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId }),
    });
    const data = await res.json();
    setMatch(data.match);
    setOptimization(null);
  };

  const fetchOptimization = async () => {
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
      <div className={styles.search}>
        {" "}
        <UiInput
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          placeholder="Type Match ID"
        />
        <UiButton text="Get Data" onClick={fetchMatch} type="submit" />
      </div>

      {match && (
        <>
          <MatchDisplay match={match} />
          <UiButton
            text="Optimize peaks"
            onClick={fetchOptimization}
            type="submit"
          />
          {optimization && <OptimizedPicks optimization={optimization} />}
        </>
      )}
    </div>
  );
};

export default MatchPage;
