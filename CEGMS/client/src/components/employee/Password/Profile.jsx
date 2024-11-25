import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Profile.module.css";
import PasswordCard from "../ProfileCard/PasswordCard.jsx";

const Profile = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <PasswordCard></PasswordCard>
      </main>
    </div>
  );
};

export default Profile;
