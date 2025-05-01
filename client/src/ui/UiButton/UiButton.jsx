import React from "react";
import styles from "./UiButton.module.css";

const UiButton = ({ text, onClick, type = "submit", disabled = false }) => {
  const buttonClass = type === "cancel" ? styles.cancel : styles.submit;
  return (
    <button
      className={`${styles.button} ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default UiButton;
