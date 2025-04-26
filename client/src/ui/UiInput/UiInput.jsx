import React from "react";
import styles from "./UiInput.module.css";
import SearchIcon from '@icons/SearchIcon';

const UiInput = ({ value, onChange, placeholder = "Search" }) => {
  return (
    <div className={styles.inputWrapper}>
      <SearchIcon className={styles.icon} size={18} />
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default UiInput;
