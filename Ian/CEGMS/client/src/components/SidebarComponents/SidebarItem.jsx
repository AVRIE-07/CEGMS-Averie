// SidebarItem.jsx
import React from "react";
import styles from "./SidebarItem.module.css"; // Import your CSS module

const SidebarItem = ({ icon, label, onClick, isActive }) => {
  return (
    <div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <img src={icon} alt={label} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default SidebarItem;
