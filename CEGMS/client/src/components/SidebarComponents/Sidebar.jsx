
import React from "react";
import styles from "./Sidebar.module.css";
import SidebarItem from "./SidebarItem";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Storagepng from './Storage.png';
import Profilepng from './Profile.png';
import Purchasepng from './Purchase.png';
import Salespng from './Sales.png';
import Settingspng from './Settings.png';
import Logoutpng from './Logout.png';
import Homepng from './Home.png';

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/760980173d59a2d245c358033baae8aea2adece7a54fe9a6473cf8160be89c8d?placeholderIfAbsent=true&apiKey=62fcf10bee394026978be26d3a6bac3b",
    label: "Home",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a5c1f4559e257abbdd049ddf5de9396be7010843b50861b4b73f12b9b16191f6?placeholderIfAbsent=true&apiKey=62fcf10bee394026978be26d3a6bac3b",
    label: "Purchase",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5d3d5befd10c953f2487cc33718c42068c7d361580ab181efef7caf6bdac4381?placeholderIfAbsent=true&apiKey=62fcf10bee394026978be26d3a6bac3b",
    label: "Sales",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6be4cda7809bd9933c5d71b05c3bf980ff606dc435179c2d98d76c883216f74a?placeholderIfAbsent=true&apiKey=62fcf10bee394026978be26d3a6bac3b",
    label: "Inventory",
  },
];

const Sidebar = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleLogout = () => {
      navigate('/Login'); // Navigate to the /logout page
    };
    const handlePurchase = () => {
      navigate('/Purchase'); // Navigate to the /logout page
    };
    const handleSales = () => {
      navigate('/Sales'); // Navigate to the /logout page
    };
    const handleStorage = () => {
      navigate('/Storage'); // Navigate to the /logout page
    };
    const handleProfile = () => {
      navigate('/Profile'); // Navigate to the /logout page
    };
    const handleDashboard = () => {
      navigate('/Dashboard'); // Navigate to the /logout page
    };
    const handleSettings = () => {
      navigate('/Settings'); // Navigate to the /logout page
    };
    
    return(
    <nav className={styles.sidebar}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0923a30939f23e4aceef99cf72de47bbc5ab5393f7b26f3b31b9439457062e33?placeholderIfAbsent=true&apiKey=62fcf10bee394026978be26d3a6bac3b"
        alt="CEGM - IMS Logo"
        className={styles.logo}
      />
      <h1 className={styles.title}>CEGM - IMS</h1>
      <div className={styles.sidebarItem}>
        
      <SidebarItem
        icon={Homepng}          
        label="Dashboard" onClick={handleDashboard}
        />
         <SidebarItem
          icon={Purchasepng}
          label="Purchase" onClick={handlePurchase}
        />
         <SidebarItem
          icon={Salespng}
          label="Sales" onClick={handleSales}
        />
        
        <SidebarItem
          icon={Storagepng}
          label="Inventory" onClick={handleStorage}
        />
      </div>
      <div className={styles.bottomItems}>
        
        <SidebarItem
          icon={Profilepng}
          label="Profile" onClick={handleProfile}
        />
        <SidebarItem
         icon={Settingspng}
          label="Settings" onClick={handleSettings}
        />
        
        <SidebarItem
          icon={Logoutpng}
          label="Log Out" onClick={handleLogout}
        />
        
      </div>
    </nav>
  );
};

export default Sidebar;
