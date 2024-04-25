import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import moment from 'moment';
import PatientNav from "./PatientNav";
import PatientSidebar from "./PatientSidebar";
import PatientMessages from "./PatientMessages";
import "./Navbar.css";
import { auth, database, storage } from "../firebaseconfig";
import { useAuth } from './AuthContext';
import { ref as databaseRef,ref, get , update, child, onValue} from "firebase/database";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import VideoConsultation from './VideoConsultation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faPenToSquare, faMessage, faPeopleGroup, faPlus, faSave, faList,faVideo, faCheck,faBell } from '@fortawesome/free-solid-svg-icons';

const PatientPage = () => {
  const [userId, setUserId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [draftNote, setDraftNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const { logout} = useAuth();
  const [userProfile, setUserProfile] = useState({
    
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    profilePhoto: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchUserDataAndAppointments = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid); // Set the user ID

          const userRef = databaseRef(database, `users/${user.uid}`);
          const userDataSnapshot = await get(userRef);
          if (userDataSnapshot.exists()) {
            const userData = userDataSnapshot.val();
            setUserProfile(userData);
          }
     

          const appointmentsRef = child(databaseRef(database), `appointments`);
          const appointmentsSnapshot = await get(appointmentsRef);
          if (appointmentsSnapshot.exists()) {
            const appointmentsData = appointmentsSnapshot.val();
            const patientAppointments =  Object.keys(appointmentsData).map(key => {
              const appointmentId = key; // Store the appointment ID
              //console.log("Appointment ID:", appointmentId);
              return {
                id: key,
                ...appointmentsData[key],
              };
            }).filter((appointment) => appointment.patientId === user.uid);
            setAppointments(patientAppointments);

             // Check for new notifications
          const newNotification = patientAppointments
          .filter(appointment => appointment.notification) // Only consider appointments with notifications
          .map(appointment => ({
            id: appointment.id,
            message: `Your appointment with Dr. ${appointment.doctorFirstName} ${appointment.doctorSurname} is approved.The appointment room is : ${appointment.notification.roomNumber}. Appointment time is ${appointment.slots}hrs.`,
            timestamp: appointment.notification.timestamp,
          }));

        setNotifications(newNotification);




          }
        }
      } catch (error) {
        console.error("Error fetching user data and appointments:", error.message);
      }
    };

    fetchUserDataAndAppointments();
  }, []);

 
  const joinVideoConsultation = async (appointment) => {
    try {
      const appointmentId = appointment.id;
        setAppointmentId(appointmentId);
        setSelectedAppointment(appointment);
        setShowVideoConsultation(true);
  
      // Emit event to server with appointment ID
      if (socket) {
        socket.emit('joinConsultation', appointmentId);
        console.log(`Sent joinConsultation event for appointment: ${appointmentId}`);
      } else {
        console.error('Socket connection not established.');
      }
    } catch (error) {
      console.error('Error joining video consultation:', error.message);
    }
  };

  const handleApproveAppointment = (appointment) => {
    // Implement logic to approve appointment
  };

  const handleAppointmentDone = (appointment) => {
    // Implement logic to mark appointment as done
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
  
        // Update the user profile details in the database
        await update(userRef, userProfile);

        // Set success message
        setSuccessMessage("You have successfully updated your data.");


  
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        console.error("User not found");
        // Handle the case where the user is not found
      }
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      
    }
  };

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io("http://localhost:3001"); 
    setSocket(newSocket);

   

         // Log socket object
    console.log('Socket:', newSocket);
    

    console.log("Fetching messages for user with ID:", userProfile.uid);
  
  
  
     // Clean up WebSocket connection on unmount
   return () => {
    if (newSocket) {
      newSocket.close();
    }
  };
  }, [userProfile.uid]);

  const sendMessage = (message) => {
    // Send message to server
    if (socket) {
      socket.emit("message", message);
    }
  };

  



  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            userData.uid = user.uid; 
            setUserProfile(userData);
            console.log("User Data:", userData); // Log user data
          setUserProfile(userData);
          } else {
            console.log("User data not found");
          }

          const storageReference = storageRef(storage, `profilePhotos/${user.uid}`);
          const downloadURL = await getDownloadURL(storageReference);
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            profilePhoto: downloadURL,
          }));
          setLoadingProfilePhoto(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Error fetching data.");
      }
    };

    // If auth.currentUser is not immediately available, use an observer to wait for authentication changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      }
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  

  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleShowNoteInput = () => {
    setShowNoteInput(true);
  };


  const handleSaveNote = () => {
    if (draftNote.trim() !== "") {
      setSavedNotes([...savedNotes, draftNote]);
      setDraftNote("");
      setShowNoteInput(false); // Hide the input field after saving the note
    }
  };

  const handleLogout = () => {
    // Call the logout function when the "Log out" link is clicked
    logout();
  };
  // Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const joinConsultation = async (appointment) => {
  // Redirect to lobby.html
  window.location.href = '/lobby.html';
};

const clearNotification = (notificationId) => {
  setNotifications(notifications.filter(n => n.id !== notificationId));
};




  return (
    <>
      <PatientNav />
      <div className="patient-container">
        <PatientSidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleMenuClick={handleMenuClick}
          selectedMenu={selectedMenu}
        />

        <div className="main-content">
          {selectedMenu === "dashboard" && (
            <>
              <div className="profile-section">
                {loadingProfilePhoto ? (
                  <p>Loading profile photo...</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={userProfile.profilePhoto}
                      alt="Profile"
                      style={{ height: '150px', width: '150px', borderRadius: '50%' }}
                    />
                    <h3 style={{ fontFamily: "Lora, serif", fontWeight: 600, marginLeft: '10px' }}>
                      Good Day {`${userProfile.firstName} ${userProfile.surname}`}
                    </h3>
                  </div>
                )}
              </div>
              <div className="line"></div>

              {/* Add three small cards above the dashboard cards */}
              <div className="small-cards">
                <div className="small-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>Todays Appointments</h4>
                  <p>0</p>

                </div>
                <div className="small-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>All Completed Appointments</h4>
                  <p>0</p>

                </div>
                <div className="small-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>Future Appointments</h4>
                  <p>1</p>

                </div>
              </div>



              <div className="dashboard-cards">
                <div className="dashboard-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '5px' }} />
                    My next Appointment</h4>

                     {/* Render details of the next appointment */}
        {appointments.length > 0 && (
          <div style={{ fontFamily: "Lora, serif",backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
            <p >Doctor Name: {appointments[0].doctorFirstName} {appointments[0].doctorSurname}</p>
            <p>Date: {appointments[0].date}</p>
            <p>Time: {appointments[0].slots}</p>
            
          </div>
        )}
        {appointments.length === 0 && (
          <p>No upcoming appointments</p>
        )}

                </div>
              
                
                <div className="dashboard-card" 
                style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>
                  <FontAwesomeIcon icon={faBell} style={{ marginRight: '5px' }} />
                  New Notification</h4>
                  <div 
                  style={{ 
                    fontFamily: "Lora, serif",
                    backgroundColor: '#e3f2fd',
                     padding: '10px', 
                     borderRadius: '5px',
                      marginTop: '10px' ,
                      }}>
                    {notifications.length > 0 ? (
                    <p>{notifications[0].message}</p>
                  
                  ) : (
                    <p>No new notifications</p>
                  )}
                </div>
              </div>
              </div>
            </>
          )}
          
          

{selectedMenu === "messages" && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <h2 style={{ fontFamily: "Lora, serif", color: "#007BFF", marginRight: "5px" ,fontSize: "30px",marginBottom: "40px"}}>
    <FontAwesomeIcon icon={faMessage} style={{ marginRight: '5px' }} />
    My Messages
  </h2>
</div>
<div className="line"></div>
 {/* Display received messages */}
 <PatientMessages patient={userProfile}  />
  
  </>
)}


{selectedMenu === "notifications" && (
  <>
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
   <h2 style={{ fontFamily: "Lora, serif", color: "#007BFF", marginRight: "50px" ,fontSize: "30px",marginBottom: "40px"}}>
    <FontAwesomeIcon icon={faBell} style={{ marginRight: '5px' }} />
    NOTIFICATIONS
  </h2>
  </div>
  <div className="line"></div>
    {notifications.length === 0 ? (
      <p>No new notifications</p>
    ) : (
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="notification-card" // Use a class for card styling
            style={{
              border: '1px solid lightgray',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              backgroundColor: '#f9f9f9',
              position: 'relative', // Important for absolute positioning of timestamp
            }}
          >
            <p>{notification.message}</p>
            <button
              onClick={() => clearNotification(notification.id)}
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'red' }}
            >
              Dismiss
            </button>
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '12px',
                color: 'gray',
              }}
            >
              {moment(notification.timestamp).format('LLL')} {/* Format the timestamp */}
            </span>
          </div>
        ))}
      </div>
    )}
  </>
)}

          {selectedMenu === "appointments" && (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <h2 style={{ fontFamily: "Lora, serif", color: "#007BFF", marginRight: "5px" ,fontSize: "30px"}}>
    <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '5px' }} />
    Appointments
  </h2>
</div>
<div className="line"></div>
{/* Filter section */}
<div style={{ display: 'flex', alignItems: 'center', marginLeft: '500px' }}>
  <select
    style={{
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid lightgrey',
      marginRight: '10px',
      fontFamily: "inherit",
    }}
  >
    <option value="all">All Appointments</option>
    <option value="today">Today's Appointments</option>
    <option value="completed">Completed Appointments</option>
    <option value="future">Future Appointments</option>
  </select>
  {/* Date picker input */}
  <input
    type="date"
    style={{
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid lightgrey',
      marginRight: '10px',
      fontFamily: "inherit",
    }}
  />
  <button
    style={{
      padding: '8px 20px',
      borderRadius: '5px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      fontFamily: "inherit",
      cursor: 'pointer',
      marginRight: '10px',
    }}
  >
    Filter
  </button>
  <button
    style={{
      padding: '8px 20px',
      borderRadius: '5px',
      backgroundColor: 'lightgrey',
      color: 'black',
      border: 'none',
      fontFamily: "inherit",
      cursor: 'pointer',
    }}
  >
    Reset
  </button>
</div>

{showVideoConsultation && selectedAppointment && (
  <div className="video-consultation-container">
    <VideoConsultation
      userId={userId}
      appointmentId={appointmentId}
      setShowVideoConsultation={setShowVideoConsultation}
      height="800px" 
    />
  </div>
)}

{/* Appointments table */}
    <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Speciality</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date</th>
                <th>Meeting Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{`${appointment.doctorFirstName} ${appointment.doctorSurname}`}</td>
                  <td>{appointment.doctorSpeciality}</td>
                  <td>{appointment.phone}</td>
                  <td>{appointment.doctorEmail}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.slots}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.status}</td>
                  <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => joinConsultation(appointment)}>
                    <FontAwesomeIcon icon={faVideo} style={{ marginRight: '5px' }} />
                      </button>
                    
                    <button onClick={() => handleAppointmentDone(appointment)}>
                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                      Done
                      </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  </>
)}


          {selectedMenu === "profile-settings" && (
  <>
    <div className="profile-container">
      <div className="profile-photo">
        <img
          src={userProfile.profilePhoto}
          alt="Profile"
          style={{ height: "150px", width: "150px", borderRadius: "50%" }}
        />
      </div>
      <div className="profile-details">
        <form>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userProfile.firstName}
            onChange={handleInputChange}
          />
          <label>Last Name:</label>
          <input
            type="text"
            name="surname"
            value={userProfile.surname}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={userProfile.email}
            onChange={handleInputChange}
          />
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={userProfile.phone}
            onChange={handleInputChange}
          />
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={userProfile.gender}
            onChange={handleInputChange}
          />
          <label>Date of Birth:</label>
          <input
            type="text"
            name="dob"
            value={userProfile.dob}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleUpdateClick}>
            Update
          </button>
        </form>
        {successMessage && (
                    <p style={{ color: "green" }}>{successMessage}</p>
                  )}  
                  {error && (
                    <p style={{ color: "red" }}>{error}</p>
                  )}
                  {error && (
                    <p style={{ color: "red" }}>{error}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientPage;
