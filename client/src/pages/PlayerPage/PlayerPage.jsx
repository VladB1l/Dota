import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleCard from "@components/TittleCard/TitleCard";
import styles from "./PlayerPage.module.css";

const PlayerPage = () => {
  const { steamId } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`http://localhost:4000/player/${steamId}`);
        const data = await res.json();
        setPlayerData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [steamId]);

  const steamAccount = playerData?.steamAccount;

  return (
    <div className={styles.profileWrapper}>
      <TitleCard
        title={steamAccount?.name || ""}
        icon={
          steamAccount?.avatar ? (
            <img
              className={styles.avatar}
              src={steamAccount.avatar}
              alt={steamAccount.name}
            />
          ) : null
        }
        theme="gray"
        isLoading={loading}
      />
    </div>
  );
};

export default PlayerPage;
