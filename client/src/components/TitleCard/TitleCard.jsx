import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { gradientByTheme } from "@ui/matchUtils";
import styles from "./TitleCard.module.css";

const TitleCard = ({ title, icon, theme = "gray", isLoading = false }) => {
  return (
    <div className={styles.card}>
      {isLoading ? (
        <Skeleton className={styles.iconWrapper} />
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
