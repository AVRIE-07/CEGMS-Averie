import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

const Storage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [stockMovements, setStockMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [addedCount, setAddedCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const fetchStockMovements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/stockMovement"
      );
      setStockMovements(response.data);
      setFilteredMovements(response.data);

      // Calculate totals
      let added = 0;
      let sold = 0;
      let returned = 0;

      response.data.forEach((movement) => {
        switch (movement.adj_Adjustment_Type) {
          case "Added":
            added += 1;
            break;
          case "Sold":
            sold += 1;
            break;
          case "Returned":
            returned += 1;
            break;
          default:
            break;
        }
      });

      // Update state with calculated totals
      setAddedCount(added);
      setSoldCount(sold);
      setReturnedCount(returned);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  // Function to handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    filterMovements(value, selectedAction);
  };

  // Function to handle dropdown selection
  const handleSelectAction = (action) => {
    setSelectedAction(action);
    filterMovements(searchQuery, action);
  };

  // Function to filter stock movements
  const filterMovements = (search, action) => {
    const filtered = stockMovements.filter((movement) => {
      const matchesSearch =
        movement.movement_ID.toString().toLowerCase().includes(search) ||
        movement.product_ID.toString().toLowerCase().includes(search) ||
        movement.adj_Description.toLowerCase().includes(search) ||
        movement.adj_Adjustment_Type.toLowerCase().includes(search) ||
        new Date(movement.adj_Date).toLocaleDateString().includes(search);

      const matchesAction = action
        ? movement.adj_Adjustment_Type === action
        : true;

      return matchesSearch && matchesAction;
    });

    setFilteredMovements(filtered);
  };

  // Pagination logic to get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);

  const getRowColor = (action) => {
    switch (action) {
      case "Added":
        return "table-success";
      case "Sold":
        return "table-danger";
      case "Returned":
        return "table-warning";
      default:
        return "";
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent} style={{ width: "100%" }}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/employee/Storage"
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/employee/Storage/StockMovement"
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/employee/Storage/Reports"
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
          <div className="d-flex align-items-center" style={{ height: "68px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="form-control"
              style={{ width: "300px" }}
            />
            <Dropdown className="ms-3" onSelect={handleSelectAction}>
              <Dropdown.Toggle
                style={{
                  backgroundColor: "#343a40", // Dark background for the toggle button
                  color: "#ffffff", // White text color
                  border: "none", // Remove border if needed
                }}
                variant="secondary"
                id="dropdown-basic"
              >
                {selectedAction || "Stock Action Filter"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  backgroundColor: "#9df1fa", // Background for dropdown items
                  border: "none", // Optional: remove border
                }}
              >
                <Dropdown.Item eventKey="">All Actions</Dropdown.Item>
                <Dropdown.Item eventKey="Added">Added</Dropdown.Item>
                <Dropdown.Item eventKey="Sold">Sold</Dropdown.Item>
                <Dropdown.Item eventKey="Returned">Returned</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="d-flex align-items-center justify-content-between text-white p-3 rounded">
              <div className="me-4 px-3 py-2 bg-success rounded">
                <strong style={{ fontWeight: "normal", color: "black" }}>
                  <i
                    className="bi bi-box-fill"
                    style={{ marginRight: "10px" }}
                  ></i>
                  Added:{addedCount}
                </strong>{" "}
              </div>
              <div className="me-4 px-3 py-2 bg-danger rounded">
                <strong style={{ fontWeight: "normal", color: "black" }}>
                  <i
                    className="bi bi-box-fill"
                    style={{ marginRight: "10px" }}
                  ></i>
                  Sold:{soldCount}
                </strong>
              </div>
              <div className="me-4 px-3 py-2 bg-warning rounded">
                <strong style={{ fontWeight: "normal", color: "black" }}>
                  <i
                    className="bi bi-box-fill"
                    style={{ marginRight: "10px" }}
                  />
                  Returned:{returnedCount}
                </strong>{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3">
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
                    Stock Action
                  </th>
                  <th scope="col" className="fw-semibold">
                    Quantity Moved
                  </th>
                  <th scope="col" className="fw-semibold">
                    Movement Date
                  </th>
                </tr>
              </thead>
              <tbody className="fs-6 align-middle table-group-divider">
                {currentItems.map((movement) => (
                  <tr
                    key={movement.movement_ID}
                    className={getRowColor(movement.adj_Adjustment_Type)}
                  >
                    <td className="text-primary">{movement.movement_ID}</td>
                    <td className="text-primary">{movement.product_ID}</td>
                    <td className="text-primary">{movement.adj_Description}</td>
                    <td className="text-primary">
                      {movement.adj_Adjustment_Type}
                    </td>
                    <td className="text-primary">{movement.adj_Quantity}</td>
                    <td className="text-primary">
                      {new Date(movement.adj_Date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Storage;
