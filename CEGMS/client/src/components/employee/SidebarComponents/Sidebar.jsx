import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.module.css";
import Logo from "./cokins.png";
import classNames from "classnames";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate(); // Importing useNavigate for routing

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    // Remove the token and user information from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("role");

    // Redirect to login page after logout
    navigate("/login");
  };

  // Sidebar links configuration
  const sidebarLinks = [
    { to: "/employee/Dashboard", icon: "bi-house", label: "Dashboard" },
    { to: "/employee/Purchase", icon: "bi-calendar-check", label: "Purchase" },
    {
      to: "/employee/Payment-History",
      icon: "bi-clock",
      label: "Payment History",
    },
    { to: "/employee/Sales", icon: "bi-bar-chart", label: "Sales" },
    { to: "/employee/Storage", icon: "bi-box-seam", label: "Storage" },
    { to: "/employee/Profile", icon: "bi-person-circle", label: "Profile" },
    {
      to: "/employee/Settings",
      icon: "bi-people-fill",
      label: "User Accounts",
    },
  ];

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

      <aside id="sidebar" className={classNames({ expand: isExpanded })}>
        <ul className="sidebar-nav">
          {sidebarLinks.slice(0, 5).map((link, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <i className={`bi ${link.icon} fs-5 me-4`}></i>
                <span className="fs-6">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          {sidebarLinks.slice(5).map((link, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <i className={`bi ${link.icon} fs-5 me-4`}></i>
                <span className="fs-6">{link.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="sidebar-item">
            {/* Logout treated as a sidebar item with the same style, but with red color */}
            <button
              className="sidebar-link logout-link"
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                padding: "8px 16px 8px 30px",
              }}
            >
              <i
                className="bi bi-box-arrow-right fs-5 me-4"
                style={{ color: "red" }}
              ></i>
              {/* Conditionally render the text based on sidebar expansion or hover */}
              <span className="fs-6 logout-text" style={{ color: "red" }}>
                Logout
              </span>
            </button>
          </li>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
