import React from "react";
import { Link } from "react-router-dom";
import styles from "./MainNavigationCard.module.css";

const MainNavigationCard = ({ label, icon, link, gradient }) => {
  const getGradient = () => {
    if (gradient === "orange") {
      return "linear-gradient(90deg, #8A540C 0%, #C07006 75%, #8A540C 100%)";
    }
    if (gradient === "purple") {
      return "linear-gradient(90deg, #441B2B 0%, #843856 75%, #441B2B 100%)";
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
      <p className={styles.label}>{label}</p>
    </Link>
  );
};

export default MainNavigationCard;
