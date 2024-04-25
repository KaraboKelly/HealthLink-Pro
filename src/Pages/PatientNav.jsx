import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { FaHome, FaBell, FaUser } from "react-icons/fa";
import logoImage from "../images/hlogo.png";
import { useAuth } from './AuthContext';

const PatientNav = () => {
  const { logout} = useAuth();

  const handleLogout = () => {
    // Call the logout function when the "Log out" link is clicked
    logout();
  };
  

  return (
    <div className="navbar" style={{ height: 80 }}>
      {/* Logo on the left */}
      <div className="logo-container">
        
        <img src={logoImage} alt="Logo" className="nav-logo" style={{ width: '125px', height: 'auto' }} />
      </div>


      {/* Icon container */}
      <div className="icon-container">
        {/* Notifications icon */}
        <FaBell className="nav-icon" style={{ fontSize: '30px', color: '#007BFF', marginTop: '10px', marginRight: '20px' }} />

        {/* Personal info icon */}
        <Link to="/profile-settings">
          <FaUser className="nav-icon" style={{ fontSize: '30px', color: '#007BFF', marginTop: '10px', marginRight: '20px' }} />
        </Link>
      </div>

      {/* Home icon */}
      <div className="home-icon-container">
        <Link to="/">
          <FaHome className="home-icon" style={{ fontSize: '30px', color: '#007BFF', marginTop: '10px', marginRight: '20px' }} />
        </Link>
      </div>

      {/* Logout icon */}
      <div className="home-icon-container">
        <Link to="/" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: '30px', color: '#007BFF', marginTop: '10px' , marginRight: '20px'}} />
        </Link>
      </div>
    </div>
  );
};

export default PatientNav;
