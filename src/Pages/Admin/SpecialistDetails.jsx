import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref as databaseRef, get, child } from 'firebase/database';
import { database } from '../../firebaseconfig';
import AdminNav from "./AdminNav";
import Sidebar from "./Sidebar";
import "../Navbar.css";

const SpecialistDetails = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSpecialistDetails = async () => {
      const specialistRef = child(databaseRef(database), `specialists/${id}`);
      const snapshot = await get(specialistRef);

      if (snapshot.exists()) {
        setSpecialist(snapshot.val());
      }
    };

    fetchSpecialistDetails();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <>
      <AdminNav />
      <div className="admin-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleMenuClick={toggleSidebar}
        />

        <div className={`main-content ${sidebarOpen ? "open" : "closed"}`}>
          <div className="specialist-header">
            <button className="go-back-btn" onClick={goBack}>
              Go Back
            </button>
          </div>

          <div className="specialist-form-container">
            {specialist && (
              <form className="specialist-details-form">
                <img
                  className="specialist-photo"
                  src={specialist.passportPhotoUrl}
                  alt=""
                />

                <div className="specialist-details-info">
                  <div className="detail">
                    <div className="label">First Name:</div>
                    <div className="value">{specialist.firstName}</div>
                  </div>

                  <div className="detail">
                    <div className="label">Last Name:</div>
                    <div className="value">{specialist.surname}</div>
                  </div>

                  <div className="detail">
                    <div className="label">Gender:</div>
                    <div className="value">{specialist.gender}</div>
                  </div>

                  <div className="detail">
                  <div className="label">Date Of Birth:</div>
                <div className="value">{specialist.dob}</div>
                </div>


                <div className="detail">
                <div className="label">Email Address:</div>
                <div className="value">{specialist.email}</div>
                </div>
                
                <div className="detail">
                <div className="label">Phone Number:</div>
                <div className="value">{specialist.phone}</div>
                </div>
                 
                <div className="detail">
                <div className="label">Speciality:</div>
                <div className="value">{specialist.speciality}</div>
                </div>
                
                <div className="detail">
                <div className="label">Qualifications:</div>
                <div className="value">{specialist.qualification}</div>
                </div>
                
                <div className="detail">
                <div className="label">Language(s):</div>
                <div className="value">{specialist.language}</div>
                </div>

                <div className="detail">
                <div className="label">Location:</div>
               <div className="value">{specialist.location}</div>
               </div>

               <div className="detail">
               <div className="label">Education Background:</div>
               <div className="value">{specialist.educationBackground}</div>
               </div>

                  
                  <div className="detail">
                    <div className="label">Copy of Medical License:</div>
                    <div className="value">
                      <a
                        href={specialist.medicalLicensesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="license-img"
                          src={specialist.medicalLicensesUrl}
                          alt="Copy Medical License"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialistDetails;
