import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faWhatsapp, faFacebook } from "@fortawesome/free-brands-svg-icons";
import logoImage from "../images/hlogo.png"; 

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#68cdff", color: "#fff", padding: "20px", textAlign: "center", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop:"" }}>
      <div>
        <img src={logoImage} alt="Logo" style={{ width: "350px", height: "auto",marginTop:"100px" }} />
      </div>
      <div>
        <h3>Contact Us</h3>
        <p>
          <FontAwesomeIcon icon={faEnvelope} /> healthlink-pro@example.com
        </p>
        <p>
          <FontAwesomeIcon icon={faWhatsapp} /> +267 73386303
        </p>
      </div>
      <div>
        <h3>Follow Us</h3>
        <p>
          <FontAwesomeIcon icon={faFacebook} /> Facebook
        </p>
        <p>
          <FontAwesomeIcon icon={faInstagram} /> Instagram
        </p>
      </div>
      <div>
        <h3>About Us</h3>
        <p>Learn more about our platform and mission.</p>
        <h3>FAQs</h3>
        <p>Find answers to common questions here.</p>
      </div>
    </footer>
  );
};

export default Footer;
