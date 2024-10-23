import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Profile.module.css";
import EmailCard from "../ProfileCard/EmailCard.jsx";

const Email = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <EmailCard></EmailCard>
      </main>
    </div>
  );
};

export default Email;
