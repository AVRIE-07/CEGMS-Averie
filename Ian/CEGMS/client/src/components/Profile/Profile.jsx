
import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Profile.module.css";
import ProfileCard from "../ProfileCard/ProfileCard.jsx";

const Profile = () => {
  return(
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <ProfileCard></ProfileCard>
      </main>
    </div>
    );
};

export default Profile;
