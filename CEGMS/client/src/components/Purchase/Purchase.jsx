
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Purchase.module.css";
import icon from "./Purchase.png"

const Purchase = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className={styles.header}>
      <img src={icon} className={styles.icon} />Purchase
      </div>  
      <div className={styles.content}>
      
      </div> 
      </main>
    </div>
  );
};

export default Purchase;
