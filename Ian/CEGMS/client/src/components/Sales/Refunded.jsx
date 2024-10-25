import React, { useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Sales.module.css";
import { Link } from "react-router-dom";

const Refunded = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'refundId', direction: 'ascending' });

  const data = [
    { refundId: 'RF-0002', description: 'Mongol Pencil No.5', quantity: 3, transactionId: 'ST-S0001', refundDate: '22/03/2024, 7:00 pm' },
    { refundId: 'RF-0001', description: 'Catleya Filler', quantity: 1, transactionId: 'ST-S0001', refundDate: '22/03/2024, 7:00 pm' },
  ];

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const arrowStyle = {
    color: 'blue', // Change this to match the tbody text color
    fontWeight: 'bold',
    marginLeft: '5px',
  };

  const columnStyles = {
    refundId: { width: '100px' },
    description: { width: '200px' },
    quantity: { width: '100px' },
    transactionId: { width: '150px' },
    refundDate: { width: '150px' },
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
                  className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
                >
                  Refunded
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Sales/Analysis"
                  className="nav-link fw-semibold text-decoration-none" style={{color:'#6a6d71'}}
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
        aria-label="Search users" style={{width:'100%',border:0, 
          outline: 'none',}}
      />
      <i className="bi bi-search fs-6"></i>
    </form>
            </div>
            <table className="table table-hover border-top">
              <thead>
                <tr>
                  <th onClick={() => requestSort('refundId')} style={{ ...columnStyles.refundId, cursor: 'pointer' }}>
                    REFUND ID
                    {sortConfig.key === 'refundId' && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => requestSort('description')} style={{ ...columnStyles.description, cursor: 'pointer' }}>
                    ITEM DESCRIPTION
                    {sortConfig.key === 'description' && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => requestSort('quantity')} style={{ ...columnStyles.quantity, cursor: 'pointer' }}>
                    QUANTITY
                    {sortConfig.key === 'quantity' && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => requestSort('transactionId')} style={{ ...columnStyles.transactionId, cursor: 'pointer' }}>
                    TRANSACTION ID
                    {sortConfig.key === 'transactionId' && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => requestSort('refundDate')} style={{ ...columnStyles.refundDate, cursor: 'pointer' }}>
                    REFUND DATE
                    {sortConfig.key === 'refundDate' && (
                      <span style={arrowStyle}>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="fs-6 align-middle table-group-divider">
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <th scope="row" className="text-primary">{item.refundId}</th>
                    <td className="text-primary">{item.description}</td>
                    <td className="text-primary">{item.quantity}</td>
                    <td className="text-primary">{item.transactionId}</td>
                    <td className="text-primary">{item.refundDate}</td>
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

export default Refunded;
