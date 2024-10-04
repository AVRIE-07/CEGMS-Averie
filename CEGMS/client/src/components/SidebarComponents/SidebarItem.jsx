import React from 'react';
import styles from './SidebarItem.module.css';

const SidebarItem = ({ icon, label, isActive, onClick }) => {
  return (
    <div className={`${styles.sidebarItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <img src={icon} alt={label} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default SidebarItem;
