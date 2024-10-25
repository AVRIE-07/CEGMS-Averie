import React, { useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Sales.module.css";
import { Link } from "react-router-dom";


const AnalysisAndReport = () => {
  const [interval, setInterval] = useState("daily");

  const salesData = {
    daily: [
      { date: "01/10/2024", totalSales: "P50,000" },
      { date: "02/10/2024", totalSales: "P75,000" },
    ],
    monthly: [
      { month: "September 2024", totalSales: "P1,500,000" },
      { month: "October 2024", totalSales: "P500,000" },
    ],
    yearly: [
      { year: "2023", totalSales: "P10,000,000" },
      { year: "2024", totalSales: "P5,000,000" },
    ],
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
      <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Sales</h5>
            </div>
            <div>
              <div className="dropdown">
              <Link to="/Sales/CreateTransaction" className="btn btn-primary">
                  + Add Transaction
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-sm px-4 py-3">
        <div className="d-flex justify-content-end">
            <ul className="nav nav-underline fs-6 text-end me-3">
              <li className="nav-item pe-3">
                <Link
                  to="/Sales"
                  className="nav-link fw-semibold text-decoration-none" style={{color:'#6a6d71'}} 
                >
                  Transaction
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Sales/Refunded"
                  className="nav-link fw-semibold text-decoration-none" style={{color:'#6a6d71'}}
                >
                  Refunded
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Sales/Analysis"
                  className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2" 
                >
                  Analysis & Report
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <div className="w-100 mb-3">
            <select
              className="form-select"
              value={interval}
              onChange={(e) => handleIntervalChange(e.target.value)}
            >
              <option value="daily">Daily Sales</option>
              <option value="monthly">Monthly Sales</option>
              <option value="yearly">Yearly Sales</option>
            </select>
          </div>

          <table className="table table-hover border-top">
            <thead>
              <tr>
                {interval === "daily" && <th>Date</th>}
                {interval === "monthly" && <th>Month</th>}
                {interval === "yearly" && <th>Year</th>}
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData[interval].map((item, index) => (
                <tr key={index}>
                  {interval === "daily" && <td>{item.date}</td>}
                  {interval === "monthly" && <td>{item.month}</td>}
                  {interval === "yearly" && <td>{item.year}</td>}
                  <td>{item.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisAndReport;
