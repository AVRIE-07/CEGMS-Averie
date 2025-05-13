import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { Chip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  const { logout } = useAuthStore();

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu);
  };

  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(0)}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                Dashboard
              </Button>
            </Link>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 1 && isToggleSubmenu ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <ShoppingCartIcon />
              </span>
              Purchasing
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 && isToggleSubmenu ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/low-stock-products">
                    Purchase Order
                  </Link>
                </li>
                <li>
                  <Link to="/grn">
                    GRN 
                  </Link>
                </li>
                <li>
                  <Link to="/rma">
                    RMA 
                  </Link>
                </li>
                <li>
                  <Link to="/back-order">
                    Backorder
                  </Link>
                </li>
                <li>
                  <Link to="/reports">
                    Reports
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 4 && isToggleSubmenu ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(4)}
            >
              <span className="icon">
                <FaUser />
              </span>
              Suppliers
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 4 && isToggleSubmenu ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/supplier/view">Supplier List</Link>
                </li>
                <li>
                  <Link to="/product/details">Supplier View</Link>
                </li>
                <li>
                  <Link to="/supplier/create">Create Supplier</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 2 && isToggleSubmenu ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(2)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Products
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 2 && isToggleSubmenu ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/storage">Products</Link>
                </li>
                <li>
                  <Link to="/storage/stockmovement">Stock Movement</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 3 && isToggleSubmenu ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(3)}
            >
              <span className="icon">
                <FaUser />
              </span>
              Users
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 3 && isToggleSubmenu ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/users">User List</Link>
                </li>
                <li>
                  <Link to="/product/details">User View</Link>
                </li>
                <li>
                  <Link to="/product/upload">Create User</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 10 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(11)}
              >
                <span className="icon">
                  <IoIosSettings />
                </span>
                Settings
                <span className="arrow">
                  <FaAngleRight />
                </span>
              </Button>
            </Link>
          </li>
        </ul>

        <br />

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button variant="contained" onClick={handleLogout}>
              <IoMdLogOut /> Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
