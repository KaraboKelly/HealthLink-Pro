// AdminNav.jsx
import React from "react";
import "./Nav.css"; 
import { FaHome, FaSearch } from "react-icons/fa";
import logoImage from "../../images/hlogo.png"; 

const AdminNav = () => {
  return (
    <div className="navbar" style={{ height: 80 }}>
      {/* Logo on the left */}
      <div className="logo-container">
        {/* Add your logo image or component here */}
        <img src={logoImage} alt="Logo" className="nav-logo" style={{ width: '125px', height: 'auto' }} />
      </div>

      {/* Search space on the right before the home icon */}
      <div className="search-container" style={{ position: 'relative', paddingRight: '10px' ,marginTop:10,marginLeft:950, borderRadius: "80px", height: '40px'}}>
        <input type="text" placeholder="Search..." className="search-input" style={{height:'40px', borderRadius: "80px"}} />
        <FaSearch className="search-icon" style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)' }} />
      </div>

      {/* Home icon on the right */}
      <div className="home-icon-container">
        <FaHome className="home-icon" style={{ fontSize: '40px', color: '#007BFF' }} />
      </div>
    </div>
  );
};

export default AdminNav;
