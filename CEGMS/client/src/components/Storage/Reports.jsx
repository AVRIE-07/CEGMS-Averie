import React, { useState, useEffect } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import { Link } from "react-router-dom";
import { Dropdown, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import LowStockModal from "./LowStockModal";
import StockMovementModal from "./stockMovementModal";

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Date Range State
  const [showModal, setShowModal] = useState(false);
  const [showStockMovementsModal, setShowStockMovementsModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [stockSummaryMovements, setStockSummaryMovements] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const handleCloseLowStockModal = () => setShowLowStockModal(false);
  const handleCloseStockMovementModal = () => setShowStockMovementsModal(false);

  const handleReportSelection = (reportType) => {
    setSelectedReportType(reportType);
    if (reportType === "Low Stock Levels") {
      handleGenerateReport();
    } else if (reportType === "Stock Movement") {
      setShowModal(true);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await axios.post("http://localhost:3001/api/reportRoutes/", {
        reportType: selectedReportType,
        startDate: fromDate || "/N/A",
        endDate: toDate || "/N/A",
      });
      fetchReports();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setShowModal(false);
      setFromDate("");
      setToDate("");
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/reportRoutes/"
      );
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleReportRowClick = (report) => {
    if (report.reportType === "Low Stock Levels") {
      const filteredProducts = products.filter(
        (product) =>
          product.product_Quantity < product.product_Minimum_Stock_Level
      );
      setLowStockProducts(filteredProducts);
      setShowLowStockModal(true);
    } else if (report.reportType === "Stock Movement") {
      const filteredStockMovements = stockMovements.filter(
        (movement) =>
          new Date(movement.adj_Date) >= new Date(report.startDate) &&
          new Date(movement.adj_Date) <= new Date(report.endDate)
      );
      setStockSummaryMovements(filteredStockMovements);
      setShowStockMovementsModal(true);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchStockMovements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/stockMovement"
        );
        setStockMovements(response.data);
      } catch (error) {
        console.error("Error fetching stock movements:", error);
      }
    };

    fetchProducts();
    fetchStockMovements();
    fetchReports();
  }, []);

  // Filter reports based on Report ID, Report Type, or Date Generated
  const filteredReports = reports.filter((report) =>
    `${report.report_ID} ${report.reportType} ${report.generatedDate}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent} style={{ width: "100%" }}>
        {/* Navigation Links */}
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/Storage"
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/Storage/StockMovement"
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Storage/Reports"
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Report Generation Card */}
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3 text-primary"></i>
              <h5 className="fw-semibold ms-3 mb-0">Storage</h5>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  + Generate Report
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleReportSelection("Low Stock Levels")}
                  >
                    Low Stock Levels
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleReportSelection("Stock Movement")}
                  >
                    Stock Movement
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="card shadow-sm px-4 py-1"
          style={{ backgroundColor: "#50504D" }}
        >
          <div className="d-flex align-items-center" style={{ height: "68px" }}>
            <input
              type="text"
              placeholder="Search by Report ID, Type, or Date..."
              className="form-control"
              style={{ width: "300px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="card shadow-sm px-4 py-3">
          <div className="table-responsive">
            <table className="table table-hover table-striped border-top">
              <thead className="table-info">
                <tr>
                  <th scope="col" className="fw-semibold">
                    Report ID
                  </th>
                  <th scope="col" className="fw-semibold">
                    Report Type
                  </th>
                  <th scope="col" className="fw-semibold">
                    Date Generated
                  </th>
                </tr>
              </thead>

              <tbody className="fs-6 align-middle table-group-divider">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => handleReportRowClick(report)}
                    >
                      <td className="text-primary">{report.report_ID}</td>
                      <td className="text-primary">{report.reportType}</td>
                      <td className="text-primary">{report.generatedDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No reports available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <LowStockModal
          show={showLowStockModal}
          handleClose={handleCloseLowStockModal}
          lowStockItems={lowStockProducts}
          style={{ width: "80%", maxWidth: "600px" }}
        />

        <StockMovementModal
          show={showStockMovementsModal}
          handleClose={handleCloseStockMovementModal}
          stockMovements={stockSummaryMovements}
          style={{ width: "100%", maxWidth: "1000px" }}
        />

        {/* Modal for Date Range Selection */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Select Date Range for {selectedReportType} Report
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="fromDate">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="toDate" className="mt-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Reports;
