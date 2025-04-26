import React from 'react';
import MainNavigationCard from '../../components/MainNavigationCard/MainNavigationCard';
import HelmetIcon from '@icons/HelmetIcon';
import SwordIcon from '@icons/SwordIcon';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.wrapper}>
      <MainNavigationCard
        label="Heroes"
        icon={<HelmetIcon />}
        link="/heroes"
        gradient="orange"
      />
      <MainNavigationCard
        label="Matches"
        icon={<SwordIcon />}
        link="/matches"
        gradient="purple"
      />
    </div>
  );
};

export default HomePage;
