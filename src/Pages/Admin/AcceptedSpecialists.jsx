import React, { useState, useEffect } from "react";
import { ref as databaseRef, get, child } from 'firebase/database';
import { database } from '../../firebaseconfig';
import AdminNav from './AdminNav'; 
import Sidebar from './Sidebar'; 
import './Accept.css';

const AcceptedSpecialists = () => {
  const [acceptedSpecialists, setAcceptedSpecialists] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); 

  useEffect(() => {
    const fetchAcceptedSpecialists = async () => {
      const acceptedSpecialistsRef = child(databaseRef(database), 'specialists');
      const snapshot = await get(acceptedSpecialistsRef);
  
      if (snapshot.exists()) {
        const acceptedSpecialistsData = [];
        snapshot.forEach((childSnapshot) => {
          const specialist = childSnapshot.val();
          // Check if the specialist is accepted and has valid firstName and surname
          if (specialist.status === "Accepted" ) {
            acceptedSpecialistsData.push({
              id: childSnapshot.key,
              name: `${specialist.firstName} ${specialist.surname}`,
              gender: specialist.gender,
              speciality: specialist.speciality,
              location: specialist.location,
              email: specialist.email,
              phone: specialist.phone,
              language: specialist.language,
              passportPhotoUrl: specialist.passportPhotoUrl,
            });
          } else {
            console.log(`Skipped specialist with ID: ${childSnapshot.key}`, specialist);
          }
        });
        setAcceptedSpecialists(acceptedSpecialistsData);
      } else {
        console.log("No accepted specialists found in the database.");
      }
    };
  
    fetchAcceptedSpecialists();
  }, []);

  return (
    <>
      <AdminNav />
      <div className="admin-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleMenuClick={toggleSidebar}
        />
       
        <div>
        <div style={{ color: "#007BFF", fontSize: "2em", fontFamily: "Lora, serif", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, marginLeft: "500px" }}>
            ALL ACCEPTED SPECIALISTS
          </div>
          <table>
            <thead>
              <tr>
                <th>Images</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Speciality</th>
                <th>Location</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Language(s)</th>
              </tr>
            </thead>
            <tbody>
              {acceptedSpecialists.map((specialist) => (
                <tr key={specialist.id}>
                  <td>
                    <img
                      src={specialist.passportPhotoUrl}
                      alt=" "
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  </td>
                  <td>{specialist.name}</td>
                  <td>{specialist.gender}</td>
                  <td>{specialist.speciality}</td>
                  <td>{specialist.location}</td>
                  <td>{specialist.email}</td>
                  <td>{specialist.phone}</td>
                  <td>{specialist.language}</td>
                  </tr>
              ))}
            </tbody>
          </table>
      </div>
      </div>
    </>
  );
};

export default AcceptedSpecialists;
