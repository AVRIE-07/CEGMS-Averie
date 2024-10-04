
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Dashboard.module.css";
import icon from "./Home.png"

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className={styles.header}>
      <img src={icon} className={styles.icon} />Dashboard
      </div>  
      <div className={styles.content}>
      
      </div> 
      </main>
    </div>
  );
};

export default Dashboard;
