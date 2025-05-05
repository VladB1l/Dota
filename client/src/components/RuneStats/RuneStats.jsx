import React from "react";

const RuneStats = ({ analysis }) => (
  <div>
    <p>
      Bounty Runes — Radiant: {analysis.bounty.R}, Dire: {analysis.bounty.D}
    </p>
    <p>
      Wisdom Runes — Radiant: {analysis.wisdom.R}, Dire: {analysis.wisdom.D}
    </p>
  </div>
);

export default RuneStats;
