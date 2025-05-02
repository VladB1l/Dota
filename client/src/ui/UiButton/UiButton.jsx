import React from "react";
import styles from "./UiButton.module.css";

const UiButton = ({ text, onClick, type = "submit", disabled = false, className }) => {
  const buttonClass = type === "cancel" ? styles.cancel : styles.submit;
  return (
    <button
      className={`${styles.button} ${buttonClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default UiButton;
