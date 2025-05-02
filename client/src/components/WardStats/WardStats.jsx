import React from "react";

export const WardStats = ({ obs, sen }) => (
  <div className="analysis-block">
    <h4>Observer Wards</h4>
    <p>
      Radiant: {obs.R}, Dire: {obs.D}
    </p>
    {obs.R + obs.D > 0 && (
      <p>
        {obs.R > obs.D
          ? `Radiant ставили на ${obs.R - obs.D} больше Observer Wards`
          : obs.D > obs.R
          ? `Dire ставили на ${obs.D - obs.R} больше Observer Wards`
          : "Количество одинаковое"}
      </p>
    )}

    <h4>Sentry Wards</h4>
    <p>
      Radiant: {sen.R}, Dire: {sen.D}
    </p>
    {sen.R + sen.D > 0 && (
      <p>
        {sen.R > sen.D
          ? `Radiant ставили на ${sen.R - sen.D} больше Sentry Wards`
          : sen.D > sen.R
          ? `Dire ставили на ${sen.D - sen.R} больше Sentry Wards`
          : "Количество одинаковое"}
      </p>
    )}
  </div>
);
