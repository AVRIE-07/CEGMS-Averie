
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Profile.module.css";
import icon from "./Profile.png"


const Profile = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className={styles.header}>
      <img src={icon} className={styles.icon} />Profile
      </div>  
      <div className={styles.content}>

      </div> 
      </main>
    </div>
  );
};

export default Profile;
