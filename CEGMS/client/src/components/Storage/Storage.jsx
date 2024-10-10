import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import { Link, Route, Routes } from "react-router-dom";

// Placeholder components for Products, Inventory Approvals, and Reports
const Products = () => <div>Products content goes here...</div>;
const InventoryApprovals = () => (
  <div>Inventory Approvals content goes here...</div>
);
const Reports = () => <div>Reports content goes here...</div>;

const Storage = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-box-seam fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Storage</h5>
            </div>
            <div className="mb-3">
              <nav className="d-flex">
                <Link to="/Storage/Overview" className="nav-link">
                  Overview
                </Link>
                <Link to="/Storage/Items" className="nav-link">
                  Items
                </Link>
                <Link to="/Storage/Reports" className="nav-link">
                  Reports
                </Link>
                <Link to="/Storage/Settings" className="nav-link">
                  Settings
                </Link>
              </nav>
            </div>
            <div>
              <Link to="/Storage/CreateTransaction" className="btn btn-primary">
                + Add Transaction
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Links */}
        <div className="card shadow-sm px-4 py-3">
          <div className="d-flex justify-content-end">
            <ul className="nav nav-underline fs-6 text-end me-3">
              <li className="nav-item pe-3">
                <Link
                  to="InventoryApprovals"
                  className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
                >
                  Inventory Approvals
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="Products"
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="Reports"
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Display content based on the selected navigation tab */}
          <div className="mt-5">
            <Routes>
              <Route path="Products" element={<Products />} />
              <Route
                path="InventoryApprovals"
                element={<InventoryApprovals />}
              />
              <Route path="Reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Storage;
