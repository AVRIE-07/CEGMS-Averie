import React, { useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Sales.module.css";
import { Link } from "react-router-dom";

const Sales = () => {
  const [sortConfig, setSortConfig] = useState({
    key: "transactionId",
    direction: "ascending",
  });

  const data = [
    {
      transactionId: "ST-S0002",
      cashierName: "Steve Job",
      totalSales: "P190,000",
      transactionDate: "22/03/2024, 7:00 pm",
    },
    {
      transactionId: "ST-S0001",
      cashierName: "Steve Job",
      totalSales: "P130,000",
      transactionDate: "22/03/2024, 7:00 pm",
    },
  ];

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const arrowStyle = {
    color: "blue", // Change this to match the tbody text color
    fontWeight: "bold",
    marginLeft: "5px",
  };

  const columnStyles = {
    transactionId: { width: "150px" },
    cashierName: { width: "150px" },
    totalSales: { width: "100px" },
    transactionDate: { width: "150px" },
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
                {/* Change the button to a Link component */}
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
                  className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
                >
                  Transaction
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Sales/Refunded"
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Refunded
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Sales/Analysis"
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Analysis & Report
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <div className="w-100 mb-3">
              <form className={styles.searchBar}>
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search by Refund ID/Transaction ID/Item Description/Refund Date"
                  aria-label="Search users"
                  style={{ width: "100%", border: 0, outline: "none" }}
                />
                <i className="bi bi-search fs-6"></i>
              </form>
            </div>
            <table className="table table-hover border-top">
              <thead>
                <tr>
                  <th
                    onClick={() => requestSort("transactionId")}
                    style={{ ...columnStyles.transactionId, cursor: "pointer" }}
                  >
                    TRANSACTION ID
                    {sortConfig.key === "transactionId" && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    onClick={() => requestSort("cashierName")}
                    style={{ ...columnStyles.cashierName, cursor: "pointer" }}
                  >
                    CASHIER NAME
                    {sortConfig.key === "cashierName" && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    onClick={() => requestSort("totalSales")}
                    style={{ ...columnStyles.totalSales, cursor: "pointer" }}
                  >
                    TOTAL SALES
                    {sortConfig.key === "totalSales" && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    onClick={() => requestSort("transactionDate")}
                    style={{
                      ...columnStyles.transactionDate,
                      cursor: "pointer",
                    }}
                  >
                    TRANSACTION DATE
                    {sortConfig.key === "transactionDate" && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="fs-6 align-middle table-group-divider">
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <th scope="row" className="text-primary">
                      {item.transactionId}
                    </th>
                    <td className="text-primary">{item.cashierName}</td>
                    <td className="text-primary">{item.totalSales}</td>
                    <td className="text-primary">{item.transactionDate}</td>
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

export default Sales;
