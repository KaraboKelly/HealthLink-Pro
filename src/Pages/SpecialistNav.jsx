import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { FaHome, FaEnvelope, FaBell, FaUser } from "react-icons/fa";
import logoImage from "../images/hlogo.png";

const SpecialistNav = () => {
  
  

  return (
    <div className="navbar" style={{ height: 80 }}>
      {/* Logo on the left */}
      <div className="logo-container">
        {/* Add your logo image or component here */}
        <img src={logoImage} alt="Logo" className="nav-logo" style={{ width: '125px', height: 'auto' }} />
      </div>

      {/* Message icon */}
      <div className="icon-container">
        <FaEnvelope className="nav-icon" style={{ fontSize: '30px', color: "#007BFF", marginRight: '50px' ,marginTop: '10px'}} />
      </div>

      {/* Notifications icon */}
      <div className="icon-container">
        <FaBell className="nav-icon" style={{ fontSize: '30px', color: "#007BFF", marginRight: '50px',marginTop: '10px' }} />
      </div>

      {/* Personal info icon */}
      <div className="icon-container">
      <Link to="/profile-settings">
        <FaUser 
        className="nav-icon" 
        style={{ fontSize: '30px', color: "#007BFF", marginRight: '50px',marginTop: '10px' }} />
          </Link>
      </div>

      {/* Home icon on the right */}
      <div className="home-icon-container">
      <Link to="/">
        <FaHome className="home-icon" style={{ fontSize: '30px', color: "#007BFF" ,marginTop: '10px'}} />
        </Link>
      </div>
    </div>
  );
};

export default SpecialistNav;
