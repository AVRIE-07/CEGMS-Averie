import { useState } from "react";
import Logo from "./cegm-logo.png";
import "./SidebarNav.css";

function SidebarNav() {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top border-bottom border-black border-1">
        <div className="d-flex align-items-center">
          <i
            className="bi bi-list fs-4 text-light toggle-btn rounded px-2"
            onClick={handleToggle}
          ></i>
          <a class="navbar-brand" href="#">
            <img
              src={Logo}
              alt=""
              className="img-fluid p-0 ms-2"
              style={{ width: 40 }}
            />
            <span className="text-white fw-semibold ms-2">CEGM-IS</span>
          </a>
        </div>
      </nav>
      <aside id="sidebar" className={isExpanded ? "expand" : ""}>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a href="#" className="sidebar-link active">
              <i className="bi bi-house fs-5 me-4"></i>
              <span className="fs-6">Dashboard</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-calendar-check fs-5 me-4"></i>
              <span className="fs-6">Purchase</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-bar-chart fs-5 me-4"></i>
              <span className="fs-6">Sales</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-box-seam fs-5 me-4"></i>
              <span className="fs-6">Inventory</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-person-circle fs-5 me-4"></i>
              <span className="fs-6">Profile</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-gear fs-5 me-4"></i>
              <span className="fs-6">Settings</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="bi bi-box-arrow-left fs-5 me-4"></i>
              <span className="fs-6">Logout</span>
            </a>
          </li>
        </div>
      </aside>
    </>
  );
}

export default SidebarNav;
