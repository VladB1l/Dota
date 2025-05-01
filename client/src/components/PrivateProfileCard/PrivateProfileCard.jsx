import React from "react";
import LockIcon from "@icons/LockIcon";
import styles from "./PrivateProfileCard.module.css";

const PrivateProfileCard = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <LockIcon className={styles.icon} />
        <h2 className={styles.title}>THIS PROFILE IS PRIVATE</h2>
      </div>
      <p className={styles.description}>
        Enable <strong>Expose Public Match Data</strong> in the Dota client to
        make your profile public.
      </p>
    </div>
  );
};

export default PrivateProfileCard;
