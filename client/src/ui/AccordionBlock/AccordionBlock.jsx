import React, { useRef, useState } from "react";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import ChevronUpIcon from "@/assets/icons/ChevronUpIcon";
import styles from "./AccordionBlock.module.css";

const AccordionBlock = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={styles.accordionWrapper}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        {open ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
      </div>
      <div
        ref={contentRef}
        className={`${styles.contentWrapper} ${open ? styles.open : ""}`}
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight + "px" : "0px",
        }}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default AccordionBlock;
