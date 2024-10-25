import React, { useState } from "react"; // Import useState from React
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap"; // Import Dropdown from react-bootstrap

const Storage = () => {
  // State for search inputs
  const [searchMovementID, setSearchMovementID] = useState("");
  const [searchProductID, setSearchProductID] = useState("");
  const [searchProductName, setSearchProductName] = useState("");
  const [searchMovementDate, setSearchMovementDate] = useState("");
  const [searchHandledBy, setSearchHandledBy] = useState("");

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent} style={{ width: "100%" }}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/Storage" // Link to Products component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/Storage/StockMovement" // Link to Inventory Approvals component
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Storage/Reports" // Link to Reports component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
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
          </div>
        </div>

        <div
          className="card shadow-sm px-4 py-1"
          style={{ backgroundColor: "#50504D" }}
        >
          {/* Dropdown for filtering by stock action */}
          <div className="d-flex align-items-center" style={{ height: "50px" }}>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Movement Type Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="">All Actions</Dropdown.Item>
                <Dropdown.Item eventKey="Added">Added</Dropdown.Item>
                <Dropdown.Item eventKey="Sold">Sold</Dropdown.Item>
                <Dropdown.Item eventKey="Returned">Returned</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3">
          {/* Search Inputs in one line maximizing width */}
          <div className="row mb-3 g-3">
            <div className="col">
              <label htmlFor="searchMovementID" style={{ fontSize: 13 }}>
                Movement ID
              </label>
              <input
                type="text"
                id="searchMovementID"
                className="form-control" // Use Bootstrap form-control for styling
                value={searchMovementID}
                onChange={(e) => setSearchMovementID(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="ID"
              />
            </div>
            <div className="col">
              <label htmlFor="searchProductID" style={{ fontSize: 13 }}>
                Product ID
              </label>
              <input
                type="text"
                id="searchProductID"
                className="form-control" // Use Bootstrap form-control for styling
                value={searchProductID}
                onChange={(e) => setSearchProductID(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="ID"
              />
            </div>
            <div className="col">
              <label htmlFor="searchProductName" style={{ fontSize: 13 }}>
                Product Name
              </label>
              <input
                type="text"
                id="searchProductName"
                className="form-control" // Use Bootstrap form-control for styling
                value={searchProductName}
                onChange={(e) => setSearchProductName(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="Name"
              />
            </div>
            <div className="col">
              <label htmlFor="searchMovementDate" style={{ fontSize: 13 }}>
                Movement Date
              </label>
              <input
                type="date"
                id="searchMovementDate"
                className="form-control" // Use Bootstrap form-control for styling
                value={searchMovementDate}
                onChange={(e) => setSearchMovementDate(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
              />
            </div>
            <div className="col">
              <label htmlFor="searchHandledBy" style={{ fontSize: 13 }}>
                Handled By
              </label>
              <input
                type="text"
                id="searchHandledBy"
                className="form-control" // Use Bootstrap form-control for styling
                value={searchHandledBy}
                onChange={(e) => setSearchHandledBy(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="Name"
              />
            </div>
          </div>

          {/* Table with responsiveness */}
          <div className="table-responsive">
            <table className="table table-hover border-top">
              <thead className="table-info">
                <tr>
                  <th scope="col" className="fw-semibold">
                    Movement ID
                  </th>
                  <th scope="col" className="fw-semibold">
                    Product ID
                  </th>
                  <th scope="col" className="fw-semibold">
                    Product Name
                  </th>
                  <th scope="col" className="fw-semibold">
                    Movement Type
                  </th>
                  <th scope="col" className="fw-semibold">
                    Quantity Moved
                  </th>
                  <th scope="col" className="fw-semibold">
                    Movement Date
                  </th>
                  <th scope="col" className="fw-semibold">
                    Handled By
                  </th>
                </tr>
              </thead>
              <tbody className="fs-6 align-middle table-group-divider">
                <tr>
                  <td className="text-primary">M001</td>
                  <td className="text-primary">P001</td>
                  <td className="text-primary">Laptop</td>
                  <td className="text-success">Added</td>
                  <td className="text-primary">10</td>
                  <td className="text-primary">01/10/2024</td>
                  <td className="text-primary">Alice Smith</td>
                </tr>
                <tr>
                  <td className="text-primary">M002</td>
                  <td className="text-primary">P002</td>
                  <td className="text-primary">Monitor</td>
                  <td className="text-danger">Sold</td>
                  <td className="text-primary">5</td>
                  <td className="text-primary">02/10/2024</td>
                  <td className="text-primary">Bob Johnson</td>
                </tr>
                <tr>
                  <td className="text-primary">M003</td>
                  <td className="text-primary">P003</td>
                  <td className="text-primary">Keyboard</td>
                  <td className="text-warning">Returned</td>
                  <td className="text-primary">3</td>
                  <td className="text-primary">03/10/2024</td>
                  <td className="text-primary">Charlie Brown</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Storage;
