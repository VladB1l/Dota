import React from "react";

export const LaneAnalysis = ({ netLead, xpLead, lanes }) => (
  <div className="analysis-block">
    <h4>Лидерство на линии (10 мин)</h4>
    <p>
      Networth Lead: {Math.abs(netLead)} ({netLead > 0 ? "Radiant" : "Dire"})
    </p>
    <p>
      Experience Lead: {Math.abs(xpLead)} ({xpLead > 0 ? "Radiant" : "Dire"})
    </p>
    <table>
      <thead>
        <tr>
          <th>Lane</th>
          <th>Winner</th>
        </tr>
      </thead>
      <tbody>
        {lanes.map((l) => (
          <tr key={l.lane}>
            <td>{l.lane}</td>
            <td>{l.winner}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
