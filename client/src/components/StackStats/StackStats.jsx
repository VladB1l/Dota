import React from "react";

export const StackStats = ({ stacks }) => (
  <div className="analysis-block">
    <h4>Camp Stacks (1–15 мин)</h4>
    <p>
      Radiant: {stacks.R}, Dire: {stacks.D}
    </p>
    {(stacks.R < 5 || stacks.D < 5) && (
      <p style={{ color: "red" }}>
        {stacks.R < 5 && "Radiant сделали меньше 5 стэков; это ошибка."}
        {stacks.D < 5 && "Dire сделали меньше 5 стэков; это ошибка."}
      </p>
    )}
  </div>
);
