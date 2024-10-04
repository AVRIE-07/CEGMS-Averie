
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Sales.module.css";
import icon from "./Sales.png"

const Sales = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className={styles.header}>
      <img src={icon} className={styles.icon} />Sales
      </div>  
      <div className={styles.content}>
      
      </div> 
      </main>
    </div>
  );
};

export default Sales;
