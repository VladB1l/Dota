import React from "react";
import styles from "./UiInput.module.css";
import SearchIcon from "@icons/SearchIcon";

const UiInput = ({ value, onChange, placeholder = "Search", onKeyDown }) => {
  return (
    <div className={styles.inputWrapper}>
      <SearchIcon className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};

export default UiInput;
