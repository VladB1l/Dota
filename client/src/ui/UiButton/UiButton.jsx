import React from "react";
import styles from "./UiButton.module.css";

const UiButton = ({ text, onClick, type = "submit" }) => {
  const buttonClass = type === "cancel" ? styles.cancel : styles.submit;
  return (
    <button className={`${styles.button} ${buttonClass}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default UiButton;
