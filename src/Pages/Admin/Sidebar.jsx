import React from "react";
import { FaHome, FaUser, FaCalendar, FaChartBar, FaCog } from "react-icons/fa";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import "../Navbar.css"; 

const Sidebar = ({ sidebarOpen, toggleSidebar, handleMenuClick, selectedMenu }) => {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Toggle button */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        {sidebarOpen ? <IoMdClose /> : <IoMdMenu />}
      </div>

      {/* Menu items */}
      <ul>
        <li onClick={() => handleMenuClick("dashboard")}>
          <FaHome />
          {sidebarOpen && <span>Dashboard</span>}
        </li>
        <li onClick={() => handleMenuClick("specialist")}>
          <FaUser />
          {sidebarOpen && <span>Specialist Management</span>}
        </li>
        <li onClick={() => handleMenuClick("appointment")}>
              <FaCalendar />
              {sidebarOpen && <span>Appointment Management</span>}
            </li>
            <li onClick={() => handleMenuClick("analytics")}>
              <FaChartBar />
              {sidebarOpen && <span>Analytics</span>}
            </li>
            <li onClick={() => handleMenuClick("settings")}>
              <FaCog />
              {sidebarOpen && <span>Settings</span>}
            </li>
      </ul>
    </div>
  );
};

export default Sidebar;
