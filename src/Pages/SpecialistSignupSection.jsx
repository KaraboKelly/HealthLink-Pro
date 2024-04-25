import React from "react";
import { Link } from "react-router-dom"; 

const SpecialistSignupSection = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "-160px", backgroundColor: "#fff", padding: "50px",  borderRadius: "60px", maxWidth: "1600px",marginLeft:"90px" ,border: "2px solid #68cdff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"}}>
      <h2 style={{ fontSize: "3em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700 }}>
        Are you a specialist interested in signing up with our platform?
      </h2>
      <p style={{ fontSize: "1.6em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 500 }}>
        Join our network of experts to connect with patients and provide online consultations.
      </p>
      <div>
      <Link to="/specialist-registration" style={{ color: "#fff", textDecoration: "none" }}>
      <button
        style={{
          padding: "20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1.5em",
          marginTop: "20px",
        }}
      >
        Sign Up Here
      </button>
      </Link>
    </div>
    </div>
  );
};

          

export default SpecialistSignupSection;
