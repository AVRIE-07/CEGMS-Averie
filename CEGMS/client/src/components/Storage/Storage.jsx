
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import icon from "./Storage.png"
const Storage = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className={styles.header}>
      <img src={icon} className={styles.icon} />Inventory
      </div>  
      <div className={styles.content}>
      
      </div> 
      </main>
    </div>
  );
};

export default Storage;
