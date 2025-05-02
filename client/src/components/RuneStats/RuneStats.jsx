import React from "react";

export const RuneStats = ({ bounty, wisdom }) => (
  <div className="analysis-block">
    <h4>Bounty Runes</h4>
    <p>
      Radiant: {bounty.R}, Dire: {bounty.D}
    </p>
    {bounty.R !== bounty.D && (
      <p>
        {bounty.R > bounty.D
          ? `Radiant подняли на ${bounty.R - bounty.D} больше Bounty-рун`
          : `Dire подняли на ${bounty.D - bounty.R} больше Bounty-рун`}
      </p>
    )}

    <h4>Wisdom Runes</h4>
    <p>
      Radiant: {wisdom.R}, Dire: {wisdom.D}
    </p>
    {wisdom.R !== wisdom.D && (
      <p>
        {wisdom.R > wisdom.D
          ? `Radiant подняли на ${wisdom.R - wisdom.D} больше Wisdom-рун`
          : `Dire подняли на ${wisdom.D - wisdom.R} больше Wisdom-рун`}
      </p>
    )}
  </div>
);
