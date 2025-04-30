import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./TitleCard.module.css";

const TitleCard = ({ title, icon, theme = "gray", isLoading = false }) => {
  const gradientByTheme = {
    orange: "linear-gradient(180deg, #8A540C 0%, #FF9100 50%, #8A540C 100%)",
    // orange: "radial-gradient(  #FF9100 50%, #8A540C 75%)",
    purple: "linear-gradient(180deg, #441B2B 0%, #843856 50%, #441B2B 100%)",
    gray: "linear-gradient(90deg,rgb(165, 164, 164) 0%, #D9D9D9 50%, rgb(165, 164, 164) 100%)",
  };
  return (
    <div className={styles.card}>
      {isLoading ? (
        <Skeleton  className={styles.iconWrapper} />
      ) : (
        <div
          className={styles.iconWrapper}
          style={{ background: gradientByTheme[theme] }}
        >
          {icon}
        </div>
      )}
      <div className={styles.rightSection}>
        <div className={styles.header}>Dota Stats</div>
        <div className={styles.title}>
          {isLoading ? <Skeleton width={120} height={20} /> : title}
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
