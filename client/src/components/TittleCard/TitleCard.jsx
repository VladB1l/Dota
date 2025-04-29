import React from "react";
import styles from "./TitleCard.module.css";

const TitleCard = ({ title, icon, theme = "gray" }) => {
  const gradientByTheme = {
    orange: "linear-gradient(180deg, #8A540C 0%, #FF9100 50%, #8A540C 100%)",
    // orange: "radial-gradient(  #FF9100 50%, #8A540C 75%)",
    purple: "linear-gradient(180deg, #441B2B 0%, #843856 50%, #441B2B 100%)",
    gray: "linear-gradient(180deg,rgb(165, 164, 164) 0%, #D9D9D9 50%, rgb(165, 164, 164) 100%)",
  };
  return (
    <div className={styles.card}>
      <div
        className={styles.iconWrapper}
        style={{ background: gradientByTheme[theme] }}
      >
        {icon}
      </div>
      <div className={styles.rightSection}>
        <div className={styles.header}>Dota Stats</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};

export default TitleCard;
