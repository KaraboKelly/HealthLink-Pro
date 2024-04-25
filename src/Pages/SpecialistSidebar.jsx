import React from "react";
import { FaHome, FaEnvelope, FaBell, FaCog, FaCalendarCheck } from "react-icons/fa";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import "./Navbar.css"; 

const SpecialistSidebar = ({ sidebarOpen, toggleSidebar, handleMenuClick, selectedMenu }) => {
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
        <li onClick={() => handleMenuClick("messages")}>
          <FaEnvelope />
          {sidebarOpen && <span>My Messages</span>}
        </li>
        <li onClick={() => handleMenuClick("notifications")}>
              <FaBell />
              {sidebarOpen && <span>Notifications</span>}
            </li>
            <li onClick={() => handleMenuClick("appointments")}>
              <FaCalendarCheck/>
              {sidebarOpen && <span>Appointments</span>}
            </li>
            <li onClick={() => handleMenuClick("profile-settings")}>
              <FaCog />
              {sidebarOpen && <span>Profile Settings</span>}
            </li>
      </ul>
    </div>
  );
};

export default SpecialistSidebar;
