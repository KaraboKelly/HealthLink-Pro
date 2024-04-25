import React, { useState, useEffect } from "react";
import { ref as databaseRef, get, child } from 'firebase/database';
import { database } from "../../firebaseconfig"; 
import "./Nav.css";

const PatientCount = () => {
    const [patientCount, setPatientCount] = useState(0);
  
    // Function to retrieve the number of registered patients
    const getRegisteredPatientsCount = async () => {
      try {
        const usersRef = child(databaseRef(database), 'users'); // Reference to the "users" node
        const snapshot = await get(usersRef); // Retrieve a snapshot of the data
        
        // Count the number of patients
        let count = 0;
        snapshot.forEach(() => {
          count++;
        });
  
        setPatientCount(count); // Set the count of registered patients
      } catch (error) {
        console.error("Error retrieving registered patients:", error.message);
      }
    };
  
    useEffect(() => {
      getRegisteredPatientsCount(); // Retrieve the count of registered patients on component mount
    }, []);
  
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Registered Patients</h5>
          <p className="card-text">{patientCount}</p>
        </div>
      </div>
    );
  };
  
export default PatientCount;
