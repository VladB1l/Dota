import React from "react";

const LaneStats = ({ analysis }) => (
  <div>
    {analysis.lanes.map((lane) => (
      <p key={lane.lane}>
        {lane.lane}: {lane.winner}
      </p>
    ))}
  </div>
);

export default LaneStats;
