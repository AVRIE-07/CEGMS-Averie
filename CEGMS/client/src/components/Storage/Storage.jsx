import React, { useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import icon from "./Storage.png";
import { Navbar, Nav } from "react-bootstrap";
import Products from "./Products"; // Import the Products component
import Reports from "./Reports"; // Import the Reports component
import InventoryApprovals from "./InventoryApprovals"; // Import the Inventory Approvals component

const Storage = () => {
  const [activeTab, setActiveTab] = useState("products"); // State to manage the active tab

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "reports":
        return <Reports />;
      case "inventory-approval":
        return <InventoryApprovals />;
      default:
        return <Products />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Bootstrap Navigation Bar */}
        <Navbar bg="light" expand="lg" className={styles.navbar}>
          <Navbar.Brand href="#home">
            <img src={icon} className={styles.icon} alt="Inventory Icon" />{" "}
            Inventory
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {" "}
              {/* Align items to the right */}
              <Nav.Link onClick={() => setActiveTab("products")}>
                Products
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("reports")}>
                Reports
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("inventory-approval")}>
                Inventory Approval
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={styles.content}>
          {renderContent()} {/* Render the content based on active tab */}
        </div>
      </main>
    </div>
  );
};

export default Storage;
