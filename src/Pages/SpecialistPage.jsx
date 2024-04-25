import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import NewMessages from './NewMessages';
import ReceivedMessages from './ReceivedMessages';
import SpecialistNav from "./SpecialistNav";
import SpecialistSidebar from "./SpecialistSidebar"; 
import "./Navbar.css";
import { auth, database, storage } from "../firebaseconfig";
import { ref as databaseRef, get,ref, update,set, child ,onValue} from "firebase/database";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faPenToSquare, faMessage, faPeopleGroup, faPlus, faSave,faList,faVideo, faCheck  } from '@fortawesome/free-solid-svg-icons';
import VideoConsultation from './VideoConsultation';
import PieChart from "./PieChart";

const SpecialistPage = () => {
  const [userId, setUserId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [ messages,setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
 // const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(true);
  const [specialistProfile, setSpecialistProfile] = useState({
    firstName: "",
    surname: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    speciality: "",
    qualification: "",
    language: "",
    location: "",
    yearsOfExperience: "",
    educationBackground: "",
    passportPhotoUrl: "",
    medicalLicensesUrl: "",
    status: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [incomingAppointmentsCount, setIncomingAppointmentsCount] = useState(0);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
   const [showNoteInput, setShowNoteInput] = useState(false);
  const [draftNote, setDraftNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    // Connect to Socket.io server for messaging
    const newSocket = io("http://localhost:3001"); 
    setSocket(newSocket);

     // Log socket object
  console.log('Socket:', newSocket);
 

  console.log("Fetching messages for specialist with ID:", specialistProfile.uid);
  
   // Clean up WebSocket connection on unmount
   return () => {
    if (newSocket) {
      newSocket.close();
    }
   
  };
}, [specialistProfile.uid]);



const sendMessage = () => {
  // Send message to server
  if (socket && message.trim() !== "") {
    const messageObject = {
      content: message,
      senderId: specialistProfile.uid, 
    };
    socket.emit("message", messageObject);
    setMessage(""); // Clear input field after sending message

    // Log the sent message
    console.log("Sent message:", messageObject);
  }
};

useEffect(() => {
  // Listen for incoming messages
  if (socket) {
    socket.on("message", (receivedMessages) => {
      console.log("Received message:", receivedMessages);
      //if (messageObject.recipientId === specialistProfile.uid) {
        // Replace 'specialist_id' with the actual ID of the specialist
        setMessages(receivedMessages);
     // }
    });
  }
// Clean up message listener on socket change or component unmount
return () => {
  if (socket) {
    socket.off("message");
  }
};
}, [socket]);

   
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSpecialistProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const specialistRef = ref(database, `specialists/${user.uid}`);

        // Update the specialist profile details in the database
        await update(specialistRef, specialistProfile);

        // Set success message
        setSuccessMessage("You have successfully updated your data.");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        console.error("User not found");
        // Handle the case where the user is not found
      }
    } catch (error) {
      console.error("Error updating specialist profile:", error.message);
      // Handle the error, show a message, or perform necessary actions
    }
  };


  useEffect(() => {
    const fetchData = async (user) => {
      try {
        if (user) {
          setUserId(user.uid);
          // Fetch specialist data
          const specialistRef = ref(database, `specialists/${user.uid}`);
          const snapshot = await get(specialistRef);
          if (snapshot.exists()) {
            const specialistData = snapshot.val();
            specialistData.uid = user.uid;
            setSpecialistProfile(specialistData);
            console.log('Specialist data:', specialistData);
          } else {
            console.error("Specialist data not found.");
          }
  
          // Fetch profile photo
          const storageReference = storageRef(storage, `passport-photos/${user.uid}`);
          const downloadURL = await getDownloadURL(storageReference);
          setSpecialistProfile((prevProfile) => ({
            ...prevProfile,
            passportPhotoUrl: downloadURL,
          }));
          setLoadingProfilePhoto(false);
  
          // Fetch appointments for the specialist
          const appointmentsRef = child(databaseRef(database), 'appointments');
          const appointmentsSnapshot = await get(appointmentsRef);
          if (appointmentsSnapshot.exists()) {
            const appointmentsData = appointmentsSnapshot.val();
            const specialistAppointments = Object.keys(appointmentsData).map(key => {
              const appointmentId = key; // Store the appointment ID
              //console.log("Appointment ID:", appointmentId);
              return {
              id: key,
              ...appointmentsData[key],
            };
            }).filter((appointment) => appointment.doctorId === user.uid);
            setAppointments(specialistAppointments);

              // Calculate the count of unique patients
          const uniquePatients = new Set(specialistAppointments.map(appointment => appointment.patientId));
          setTotalPatients(uniquePatients.size);

            // Calculate the count of incoming appointments
          const incomingAppointments = specialistAppointments.filter(appointment => appointment.status === "Incoming");
          setIncomingAppointmentsCount(incomingAppointments.length);

           // Calculate the count of pending appointments
           const pendingAppointments = specialistAppointments.filter(appointment => appointment.status === "pending");
           setPendingAppointmentsCount(pendingAppointments.length);
          }
        } else {
          console.error("User not logged in.");
          setSpecialistProfile(null); // Reset specialist profile if user is not logged in
          setLoadingProfilePhoto(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Error fetching data.");
      }
    };
 
    
  
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      await fetchData(user);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleApproveAppointment = async (appointment) => {
    try {
      console.log("Approving appointment with ID:", appointment.id);
  
      const appointmentRef = child(databaseRef(database), `appointments/${appointment.id}`);
      console.log("Appointment reference:", appointmentRef.toString());
  
      // Update only the "status" field in the database
      await update(appointmentRef, { 
        status: "Incoming",
        notification: {
          type: "appointment-approved",
          roomNumber: generateRoomNumber(), // Generate a room number
          timestamp: Date.now(), 
        },
       });

      // Update the appointment status in the local state
      const updatedAppointments = appointments.map((appt) =>
        appt.id === appointment.id ? { ...appt, status: "Incoming" } : appt
      );
      setAppointments(updatedAppointments);
  
      console.log("Appointment approved successfully.");
    } catch (error) {
      console.error('Error updating appointment status:', error.message);
    }
  };

  //  function to generate a room number
const generateRoomNumber = () => {
  return `room-${Math.random().toString(36).substr(2, 8)}`;
};
  
  const handleAppointmentDone = async (appointment) => {
    try {
      console.log("Marking appointment as done with ID:", appointment.id);
  
      const appointmentRef = child(databaseRef(database), `appointments/${appointment.id}`);
      console.log("Appointment reference:", appointmentRef.toString());
  
      // Update only the "status" field in the database
      await update(appointmentRef, { status: 'Done' });
  
      // Update the appointment status in the local state
      const updatedAppointments = appointments.map((appt) =>
        appt.id === appointment.id ? { ...appt, status: 'Done' } : appt
      );
      setAppointments(updatedAppointments);
  
      console.log("Appointment marked as done successfully.");
    } catch (error) {
      console.error('Error marking appointment as done:', error.message);
    }
  };
  

  const startConsultation = async (appointment) => {
    // Redirect to lobby.html
    window.location.href = '/lobby.html';
  };




  const chartData = {
    labels: ['Incoming Appointments', 'Pending Appointments'],
    datasets: [{
      label: 'Appointments',
      data: [incomingAppointmentsCount, pendingAppointmentsCount],
      backgroundColor: ['#36a2eb', '#ffcd56'],
      borderWidth: 1,
    }],
  };

  const calculateTotalPatients = () => {
    // Calculate total number of patients based on appointments data
    return appointments.length;
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

   // Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


         
  return (
    <>
      <SpecialistNav />
      <div className="specialist-container">
        <SpecialistSidebar
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={specialistProfile.passportPhotoUrl}
                      alt="Profile"
                      style={{
                        height: "150px",
                        width: "150px",
                        borderRadius: "50%",
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: "Lora, serif",
                        fontWeight: 600,
                        marginLeft: "10px",
                      }}
                    >
                      Good Day {`${specialistProfile.firstName} ${specialistProfile.surname}`}
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
                  <h4 style={{ fontFamily: "Lora, serif", fontWeight: 400, marginLeft: '10px' }}>
                  <FontAwesomeIcon icon={faPeopleGroup} style={{ marginRight: '5px' }} />
                    Total Patients</h4>
                    <p>{totalPatients}</p>

                </div>
              </div>



              <div className="dashboard-cards">
                <div className="dashboard-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '5px' }} />
                   Incoming Appointments
                    </h4>
                    <p>{incomingAppointmentsCount}</p>
                     {/* Render the PieChart component */}
                     <PieChart data={chartData} />
                </div>
               
      
                
                <div className="dashboard-card" style={{ borderLeft: `5px solid ${getRandomColor()}` }}>
                  <h4>
                  <FontAwesomeIcon icon={faMessage} style={{ marginRight: '5px' }} />
                    Latest Messages
                    </h4>
                  {/* Display New Messages */}
                <NewMessages newMessages={newMessages} specialist={specialistProfile} />
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
    <ReceivedMessages specialist={specialistProfile}  />
  
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
            <th>Patient Name</th>
            <th>Gender</th>
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
              <td>{`${appointment.firstName} ${appointment.surname}`}</td>
              <td>{appointment.gender}</td>
              <td>{appointment.phone}</td>
              <td>{appointment.email}</td>
              <td>{appointment.date}</td>
              <td>{appointment.slots}</td>
              <td>{appointment.reason}</td>
              <td>{appointment.status}</td> 
              <td>
                <button onClick={() => startConsultation(appointment)}>
                <FontAwesomeIcon icon={faVideo} style={{ marginRight: '5px' }} />
                  </button>
                <button onClick={() => handleApproveAppointment(appointment)}>Approve</button>
                <button onClick={() => handleAppointmentDone(appointment)}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                  Done
                  </button>
                
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
                    src={specialistProfile.passportPhotoUrl}
                    alt="Profile"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="profile-details">
                  <form>
                    <label>First Name:</label>
                    <input
                      type="text"
                      name="firstName"
                      value={specialistProfile.firstName}
                      onChange={handleInputChange}
                    />
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="surname"
                      value={specialistProfile.surname}
                      onChange={handleInputChange}
                    />
                    <label>Email:</label>
                    <input
                      type="text"
                      name="email"
                      value={specialistProfile.email}
                      onChange={handleInputChange}
                    />
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phone"
                      value={specialistProfile.phone}
                      onChange={handleInputChange}
                    />
                    <label>Gender:</label>
                    <input
                      type="text"
                      name="gender"
                      value={specialistProfile.gender}
                      onChange={handleInputChange}
                    />
                    <label>Date of Birth:</label>
                    <input
                      type="text"
                      name="dob"
                      value={specialistProfile.dob}
                      onChange={handleInputChange}
                    />
                    {/* Add other fields as needed */}
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};



export default SpecialistPage;