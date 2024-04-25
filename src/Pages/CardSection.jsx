import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faLocationDot, faCalendarCheck, faComments } from '@fortawesome/free-solid-svg-icons';

const CardSection = () => {
  const cardStyle = {
    flex: 1,
    marginRight: "20px",
    textAlign: "center",
    border: "1px solid #ddd", // Add border styles
    borderRadius: "10px", // Add border-radius for rounded corners
    padding: "20px", // Add padding for better appearance
   
  };

  const iconStyle = {
    fontSize: "8em",
    color: "#007BFF", // Set the icon color to blue
    marginBottom: "10px",
  };

  return (
    <div style={{ marginTop: "80px", display: "flex", justifyContent: "center" }}>
      {/* Card 1 */}
      <div style={cardStyle}>
        <FontAwesomeIcon icon={faStethoscope} style={iconStyle} />
        <h2 style={{ fontSize: "2.6em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700, marginBottom: "20px" }}>
          Doctors
        </h2>
        <p style={{ fontSize: "1.5em" }}>Search for Doctors by name or their specialty.</p>
      </div>
      {/* Card 2 */}
      <div style={cardStyle}>
        <FontAwesomeIcon icon={faLocationDot} style={iconStyle} />
        <h2 style={{ fontSize: "2.6em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700, marginBottom: "20px" }}>
          Location
        </h2>
        <p style={{ fontSize: "1.5em" }}>Find care in an area convenient for you.</p>
      </div>
      {/* Card 3 */}
      <div style={cardStyle}>
        <FontAwesomeIcon icon={faCalendarCheck} style={iconStyle} />
        <h2 style={{ fontSize: "2.6em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700, marginBottom: "20px" }}>
          Appointments
        </h2>
        <p style={{ fontSize: "1.5em" }}>Schedule your appointments online.</p>
      </div>
      {/* Card 4 */}
      <div style={cardStyle}>
        <FontAwesomeIcon icon={faComments} style={iconStyle} />
        <h2 style={{ fontSize: "2.6em", color: "#000000", fontFamily: "Lora, serif", fontWeight: 700, marginBottom: "20px" }}>
          Chats
        </h2>
        <p style={{ fontSize: "1.5em" }}>Be able to communicate with your Doctors.</p>
      </div>
    </div>
  );
};

export default CardSection;
