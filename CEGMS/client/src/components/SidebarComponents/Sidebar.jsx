import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.module.css";
import Logo from "./cokins.png";

const Sidebar = () => {
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
          <a className="navbar-brand" href="/Dashboard">
            <img
              src={Logo}
              alt="cegm-logo"
              className="img-fluid p-0 ms-2"
              style={{ width: 40 }}
            />
            <span className="text-white fw-semibold ms-3">CEGM-IS</span>
          </a>
        </div>
      </nav>
      <aside id="sidebar" className={isExpanded ? "expand" : ""}>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <NavLink
              to="/Dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-house fs-5 me-4"></i>
              <span className="fs-6">Dashboard</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Purchase"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-calendar-check fs-5 me-4"></i>
              <span className="fs-6">Purchase</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Payment-History"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-clock fs-5 me-4"></i>
              <span className="fs-6">Payment History</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Sales"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-bar-chart fs-5 me-4"></i>
              <span className="fs-6">Sales</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Storage"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-box-seam fs-5 me-4"></i>
              <span className="fs-6">Storage</span>
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <li className="sidebar-item">
            <NavLink
              to="/Profile"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-person-circle fs-5 me-4"></i>
              <span className="fs-6">Profile</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Settings"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-gear fs-5 me-4"></i>
              <span className="fs-6">User Accounts</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink
              to="/Login"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className="bi bi-box-arrow-left fs-5 me-4"></i>
              <span className="fs-6">Logout</span>
            </NavLink>
          </li>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
