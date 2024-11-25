import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Profile.module.css";
import ProfileCard from "../ProfileCard/ProfileCard.jsx";

const Profile = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle fs-3"></i>{" "}
            <h5 className="fw-semibold ms-3 mb-0">Profile</h5>
          </div>
        </div>
        <div className="card shadow-sm p-5 h-100">
          {" "}
          <ProfileCard></ProfileCard>
        </div>
      </main>
    </div>
  );
};

export default Profile;
