import React, { useState, useEffect } from "react";
import { ref as databaseRef, get, child } from "firebase/database";
import { database } from "../../firebaseconfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const Dash = () => {
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalSpecialistsCount, setTotalSpecialistsCount] = useState(0);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);

  // Function to retrieve the count of users, specialists, and patients
  const fetchCounts = async () => {
    try {
      const usersRef = child(databaseRef(database), 'users'); // Reference to the "users" node
      const specialistsRef = child(databaseRef(database), 'specialists'); // Reference to the "specialists" node

      // Get the data from Firebase
      const usersSnapshot = await get(usersRef);
      const specialistsSnapshot = await get(specialistsRef);

      // Calculate the counts
      let usersCount = 0;
      let specialistsCount = 0;

      // Count total users and patients (assuming "users" contain all registered patients)
      usersSnapshot.forEach(() => {
        usersCount++;
      });

      // Count total specialists
      specialistsSnapshot.forEach(() => {
        specialistsCount++;
      });

      // Update the state with the new counts
      setTotalUsersCount(usersCount + specialistsCount);
      setTotalSpecialistsCount(specialistsCount);
      setTotalPatientsCount(usersCount);

    } catch (error) {
      console.error("Error retrieving counts:", error.message);
    }
  };

  useEffect(() => {
    fetchCounts(); // Fetch counts on component mount
  }, []);

  return (

    <div
    style={{
      display: "flex",
      justifyContent: "space-between", // Keep cards evenly spaced
      padding: "20px", // Optional padding
    }}
  >
    <div
      className="card"
      style={{
        flex: "1", 
        backgroundColor: "white", 
        marginRight: "10px", 
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faUsers} size="4x" style={{ color: "#D3D3D3", marginRight: "10px" }} />
        <div className="card-body">
          <h5 className="card-title">Total Registered Users</h5>
          <p className="card-text">{totalUsersCount}</p>
        </div>
      </div>
    </div>

    <div
      className="card"
      style={{
        flex: "1",
        marginRight: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faUsers} size="4x" style={{ color: "#D3D3D3", marginRight: "10px" }} />
        <div className="card-body">
          <h5 className="card-title">Total Registered Specialists</h5>
          <p className="card-text">{totalSpecialistsCount}</p>
        </div>
      </div>
    </div>

    <div
      className="card"
      style={{
        flex: "1",
        marginRight: "10px",
       
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faUsers} size="4x" style={{ color: "#D3D3D3", marginRight: "10px" }} />
        <div class="card-body">
          <h5 className="card-title">Total Registered Patients</h5>
          <p className="card-text">{totalPatientsCount}</p>
        </div>
      </div>
    </div>
  </div>
);
};

    

export default Dash;
