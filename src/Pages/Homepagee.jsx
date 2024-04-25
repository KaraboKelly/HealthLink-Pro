import React from "react";
import CustomNav from "./CustomNav";
import homepageVideo from "../images/video.mp4";
import CardSection from "./CardSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import YourComponent from "./YourComponent";
import SpecialistSection from "./SpecialistSection";
import SpecialistSignupSection from "./SpecialistSignupSection";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Homepagee = () => {
  return (
    <>
      {/* Navbar */}
      <CustomNav />
      {/* Landing Video Background */}
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          marginTop: "40px",
        }}
      >
        {/* Content Section */}
        <div
          style={{
            flex: "0 0 50%",
            padding: "100px",
            color: "#000000",
            fontFamily: "Roboto, sans-serif",
            position: "relative", // Added position relative
          }}
        >
          {/* HealthLink Pro Section */}
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontSize: "4.5em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 700 }}>
              Bridging Gaps,
            </h2>
            <h2 style={{ fontSize: "4.5em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 700 }}>
              Building Healthier Lives.
            </h2>
            <p style={{ fontSize: "1.6em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 500 }}>
              Explore our platform to discover a network of specialists and seamlessly request online consultations, connecting you with expert care from the comfort of your own space.
            </p>

          {/* Button for Searching Doctors */}
         <div style={{ marginTop: "40px" }}>
      <Link to="/home-search">
  <button
    style={{
      padding: "15px 25px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #007BFF",
      fontSize: "30px",
      backgroundColor: "transparent",
      cursor: "pointer", 
      color: "#007BFF" , 
    }}
  >
    See available specialists
  </button>
  </Link>
  </div>

          
         
           
          </div>
        </div>

        {/* Video Section */}
        <div
          style={{
            flex: "0 0 50%",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <video
            autoPlay
            loop
            muted
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              right: 0,
            }}
          >
            <source src={homepageVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* Card Section */}
      <CardSection />
      <div style={{ margin: "40px 0" }}>
        <YourComponent />
      </div>
      <SpecialistSection />
      {/* SpecialistSignupSection */}
      <div style={{ position: "absolute", zIndex: 2, marginTop: "-40px",  width: "100%", }} > 
        <SpecialistSignupSection />
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Homepagee;
