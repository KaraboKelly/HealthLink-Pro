import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faLocationDot, faStar ,faGraduationCap,faUserNurse, faMessage, faCalendarCheck} from "@fortawesome/free-solid-svg-icons";
import { ref as databaseRef, get, child } from 'firebase/database';
import { database } from '../firebaseconfig';
import MessagingContainer from './MessagingContainer'; 
import { useAuth } from './AuthContext';
import logoImage from "../images/hlogo.png";
import BookingPage from './BookingPage';


function ShowMore() {
  const { id ,pid: patientId, firstNamee, surnamee, speciality, docemail} = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false); 
  const [showConsultButton, setShowConsultButton] = useState(true);
  const {user: patient  }= useAuth();

  
  useEffect(() => {
    const fetchSpecialistDetails = async () => {
      const specialistRef = child(databaseRef(database), `specialists/${id}`);
      const snapshot = await get(specialistRef);

      if (snapshot.exists()) {
       const specialistData = snapshot.val();
       specialistData.uid = id; 
       setSpecialist(specialistData);

      }
    };

    fetchSpecialistDetails();
  }, [id, firstNamee, surnamee, speciality,docemail]);
  

  if (!specialist) {
    return <div>Loading...</div>; // Add loading state
  }



  const name = specialist ? `${specialist.firstName} ${specialist.surname}` : '';
 // const isLoggedIn = !!patient;


    const handleConsultClick = () => {
      if (showMessaging) {
        // Close the messaging container if it's open
        setShowMessaging(false);
      } else {
      if (patient) {
        setShowMessaging(true);
        //setShowConsultButton(false);
      } else {
        // Redirect to registration page if not logged in
        window.location.href = '/register';
      }
      }
    };

    const handleMessagingClose = () => {
      setShowMessaging(false);
   
    };
  
  return (
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
       <img src={logoImage} alt="Logo" style={{ width: '150px', marginBottom: '1px' }} />
       <div
  style={{
    width: '100%',
    height: '2px',
    backgroundColor: '#007BFF',
    margin: '12px 0', 
    boxShadow: '0px 4px 8px rgba(173, 216, 230, 0.5)', 
  }}
/>
       

      {/* "Book Appointment" button and "Chat" button at the top-right corner */}
      <div style={{ position: 'absolute', top: '200px', right: '180px', zIndex: '999' }}>
      
        
        {showBookingModal && (
            <BookingPage 
            id={specialist.uid}
            pid={patientId} 
            firstNamee={specialist.firstName}
            surnamee={specialist.surname}
            speciality={specialist.speciality}
            docemail={specialist.email}
            initialPatientDetails={{
              firstName: patient.firstName || '',
              surname: patient.surname || '',
              gender: patient.gender || '',
              phone: patient.phone || '',
              email: patient.email || '',
              date:'',
              slots: '',
              reason: '',
            }}
            onClose={() => setShowBookingModal(false)} />
          
      )}

        {/* "Chat" button */}
       
        {/* Conditionally render MessagingContainer or Consult button */}
 {showMessaging ? (
        <MessagingContainer specialist={specialist} onClose={handleMessagingClose}/>
      ) : null}
      </div>


      
      {/* Specialist Card */}
      <div style={{ display: 'flex', width: '40%', marginBottom: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden',marginTop:'50px' }}>
        {/* Image container on the left */}
        <div style={{ width: '30%', position: 'relative', marginRight: '20px' }}>
          <img src={specialist.passportPhotoUrl} alt="" style={{ width: '100%', height: 'auto', maxHeight: '300px', borderRadius: '8px' }} />
        </div>

        {/* Details on the right */}
        <div style={{ padding: '15px', width: '70%', boxSizing: 'border-box' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '25px', fontFamily: "Lora, serif" }}>{`Dr. ${name || ''}`}</h3>
          <h3>{specialist.qualification}</h3>
          <h3>
            <FontAwesomeIcon icon={faComments} style={{ marginRight: '5px', color: "#007BFF", marginTop: '10px' }} />
            {specialist.language}
          </h3>
          <h3>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '5px', color: "#CCCCCC", marginTop: '10px' }} />
            {specialist.location}
          </h3>
            {/* Years of Experience box */}
          <div style={{
           display: 'flex',
           justifyContent: 'center',
           backgroundColor: '#87CEEB',
           padding: '5px 10px',
           borderRadius: '10px',
           color: '#fff',
           fontSize: '14px',
           marginTop: '10px',
           width:'140px',
      }}>
        {specialist.yearsOfExperience} years exp
      </div>
        <div style={{ marginTop: '40px',}}>
        <button
          style={{
            backgroundColor: "transparent",
            color: "#007BFF",
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            border: "1px solid #007BFF",
            fontSize: '16px',
            marginRight: '10px',
            marginTop: '10px',
          }}
          onClick={() => setShowBookingModal(true)}
        >
          <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '5px' }} />
          Book Appointment
        </button>

        {/* "Chat" button */}
        <button
          style={{
            backgroundColor: "transparent",
            color: "#007BFF", 
            padding: '10px',
            border: "1px solid #007BFF",
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '20px',
          }}
          onClick={handleConsultClick}
        >
           <FontAwesomeIcon icon={faMessage} style={{ marginRight: '5px' }} />
          Chat
        </button>
        </div>
        </div>
      </div>

    

      {/* Additional details at the bottom */}
<div style={{ padding: '15px', width: '40%', backgroundColor: '#f5f5f5', borderRadius: '8px', marginTop: '10px' }}>
  {/* Specialities section */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
    <div style={{ backgroundColor: '#87CEEB', borderRadius: '50%', padding: '8px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesomeIcon icon={faStar} style={{ color: '#fff', fontSize: '18px' }} />
    </div>
    <h3 style={{ marginBottom: '5px',fontFamily: "Lora, serif",fontWeight:700 }}>Specialities</h3>
  </div>
  <h3>{specialist.speciality}</h3>
  <hr style={{ margin: '10px 0' }} />

  {/* Education section */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
    <div style={{ backgroundColor: '#87CEEB', borderRadius: '50%', padding: '6px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#fff', fontSize:'18px' }} />
    </div>
    <h3 style={{ marginBottom: '5px',fontFamily: "Lora, serif" ,fontWeight:700}}>Education</h3>
  </div>
  <h3>{specialist.educationBackground}</h3>
  <h3>{specialist.qualification}</h3>
  <hr style={{ margin: '10px 0' }} />

  {/* About Me section */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
    <div style={{ backgroundColor: '#87CEEB', borderRadius: '50%', padding: '8px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesomeIcon icon={faUserNurse} style={{ color: '#fff', fontSize:'18px'  }} />
    </div>
    <h3 style={{ marginBottom: '5px' ,fontFamily: "Lora, serif" ,fontWeight:700}}>About Me</h3>
  </div>
  <h3>Dr. {specialist.surname} is currently at {specialist.location} working as {specialist.speciality} specialist.</h3>
  
</div>



 
    </div>
  );
}

export default ShowMore;
