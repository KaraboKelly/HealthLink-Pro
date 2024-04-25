import React, { useState} from "react";
import "./Navbar.css";
import logoImage from "../images/hlogo.png"; 
import { Link } from "react-router-dom";
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout} = useAuth();
  

 

  const handleLogout = () => {
    // Call the logout function when the "Log out" link is clicked
    logout();
  };


  return (
    <div className="Navbar">
      <img src={logoImage} alt="MIMS Logo" className="nav-logo" />
      <div className={`nav-items ${isOpen && "open"}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <Link to="/specialist-registration">Sign Up</Link>
        <Link to="/register">Log In</Link>
        <Link to ="/"  onClick={handleLogout}>Log Out </Link>
        <Link to="/patient-page">Profile</Link>
        
      </div>
      <div
        className={`nav-toggle ${isOpen && "open"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default Navbar;
