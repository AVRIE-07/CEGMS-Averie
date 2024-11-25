import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-house-fill fs-3"></i>
            <h5 className="fw-semibold ms-3 mb-0">Dashboard</h5>
          </div>
        </div>
        <div className="card shadow-sm p-5 h-100"></div>
      </main>
    </div>
  );
};

export default Dashboard;
