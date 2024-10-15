import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import { Link } from "react-router-dom";

const Storage = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/Storage" // Link to Products component
                className="nav-link fw-semibold text-decoration-none "
                style={{ color: "#6a6d71" }}
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/Storage/StockMovement" // Link to Inventory Approvals component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Storage/Reports" // Link to Reports component
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Reports
              </Link>
            </li>
          </ul>
        </div>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Storage</h5>
            </div>
            <div>
              <div className="dropdown">
                {/* Change the button to a Link component */}
                <Link
                  to="/Storage/CreateTransaction"
                  className="btn btn-primary"
                >
                  + Add Transaction
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Storage;
