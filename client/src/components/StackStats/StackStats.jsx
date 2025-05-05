import React from "react";

const StackStats = ({ analysis }) => (
  <div>
    <p>
      Camp Stacks — Radiant: {analysis.stacks.R}, Dire: {analysis.stacks.D}
    </p>
  </div>
);



export default StackStats;