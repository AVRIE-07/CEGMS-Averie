import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Settings.module.css";
import icon from "./Settings.png";
import UserManagement from "../UserManagement/UserManagement";

const Settings = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <i class="bi bi-people-fill"></i>
          User Accounts
        </div>
        <div className={styles.content}>
          <UserManagement></UserManagement>
        </div>
      </main>
    </div>
  );
};

export default Settings;
