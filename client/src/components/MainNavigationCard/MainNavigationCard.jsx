import React from "react";
import { Link } from "react-router-dom";
import styles from "./MainNavigationCard.module.css";

const MainNavigationCard = ({ label, description, icon, link, gradient }) => {
  const getGradient = () => {
    if (gradient === "orange") {
      return "linear-gradient(90deg, #8A540C 0%, #C07006 50%, #8A540C 100%)";
    }
    if (gradient === "purple") {
      return "linear-gradient(90deg, #441B2B 1%, #843856 50%, #441B2B 100%)";
    }
    return "#333";
  };

  return (
    <Link
      to={link}
      className={styles.card}
      style={{ background: getGradient() }}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.textBlock}>
        <p className={styles.label}>{label}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
};

export default MainNavigationCard;
