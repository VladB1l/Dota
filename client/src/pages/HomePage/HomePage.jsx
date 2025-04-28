import React, { useEffect, useState } from "react";
import MainNavigationCard from "../../components/MainNavigationCard/MainNavigationCard";
import MetaState from "../../components/MetaState/MetaState";
import HelmetIcon from "@icons/HelmetIcon";
import SwordIcon from "@icons/SwordIcon";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch("http://localhost:4000/meta", {
          method: "GET",
        });
        const data = await res.json();
        setMetaData(data);
      } catch (error) {
        console.error("Ошибка при загрузке меты:", error);
      }
    };

    fetchMeta();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <MetaState metaData={metaData} />
      <div className={styles.cardsWrapper}>
        <MainNavigationCard
          label="Heroes"
          description="View stats, builds and information about Dota 2 heroes"
          icon={<HelmetIcon size={44} />}
          link="/heroes"
          gradient="orange"
        />
        <MainNavigationCard
          label="Matches"
          description="Search for Dota 2 matches and view detailed statistics"
          icon={<SwordIcon size={44} />}
          link="/matches"
          gradient="purple"
        />
      </div>
    </div>
  );
};

export default HomePage;
