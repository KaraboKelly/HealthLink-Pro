import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref as databaseRef, get, child, onValue, set } from 'firebase/database';
import { database } from '../../firebaseconfig';
import './Admin.css';

const SpecialistManagement = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const applicationsRef = child(databaseRef(database), 'specialists');
      const snapshot = await get(applicationsRef);

      if (snapshot.exists()) {
        const applicationsData = [];
        snapshot.forEach((childSnapshot) => {
          const application = childSnapshot.val();
          applicationsData.push({
            id: childSnapshot.key,
            name: `${application.firstName} ${application.surname}`,
            gender: application.gender,
            speciality: application.speciality,
            location: application.location,
            status: application.status || "Pending",
          });
        });
        setApplications(applicationsData);
      }
    };

    const applicationsRef = child(databaseRef(database), 'specialists');
    const unsubscribe = onValue(applicationsRef, () => {
      fetchApplications();
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (id) => {
    console.log("Accepting application with ID:", id);

    const applicationRef = child(databaseRef(database), `specialists/${id}`);
  
    // Fetch the existing details from the database
    const snapshot = await get(applicationRef);
    const existingDetails = snapshot.val();
  
    // Update only the "status" field in the database
    await set(applicationRef, {
      ...existingDetails,
      status: "Accepted",
    });
  
    // Update the state to exclude the accepted application
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== id)
    );
  };

  const handleReject = async (id) => {
    console.log("Rejecting application with ID:", id);

    const applicationRef = child(databaseRef(database), `specialists/${id}`);
  
    try {
       // Fetch the existing details from the database
    const snapshot = await get(applicationRef);
    const existingDetails = snapshot.val();

      // Update only the "status" field in the database
      await set(applicationRef, {
        ...existingDetails,
        status: "Rejected",
      });

       // Update the status of the rejected application in the local state
    setApplications((prevApplications) =>
    prevApplications.map((app) =>
      app.id === id ? { ...app, status: "Rejected" } : app
    )
  );
} catch (error) {
  console.error("Error rejecting application:", error);
  // Handle error
}
};

  console.log("After accepting:", applications);

  
   
  return (
    <div>
      <div style={{ color: "#007BFF", fontSize: "2em", fontFamily: "Lora, serif", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, marginLeft: "500px" }}>
        <h2>NEW APPLICATIONS</h2>
      
        <Link to="/accepted-specialists">
          <button style={{ padding: "25px", backgroundColor: "#FFFFFF", color: "#007BFF", border: "2px solid #007BFF", borderRadius: "50px", fontSize: "16px", cursor: "pointer" }}>Show All</button>
        </Link>
      </div>
      <div style={{ height: '5px',backgroundColor: 'lightblue', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}></div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Speciality</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications
          .filter((application) => application.status === "Pending" || application.status === "Rejected")
          .map((application) => (
            <tr key={application.id}>
              <td>
                {/* Use Link to create a clickable row that navigates to the specialist details page */}
                <Link to={`/specialist-details/${application.id}`}>{application.name}</Link>
              </td>
              <td>{application.gender}</td>
              <td>{application.speciality}</td>
              <td>{application.location}</td>
              <td>{application.status}</td>
              <td>
              {application.status === "Pending" && (
                  <>
                    <button onClick={() => handleAccept(application.id)}>Accept</button>
                    <button onClick={() => handleReject(application.id)}>Reject</button>
                  </>
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecialistManagement;
