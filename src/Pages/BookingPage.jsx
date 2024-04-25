import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ref as databaseRef, push , get, child} from 'firebase/database';
import { database, auth } from '../firebaseconfig';
import "./SpecialistReg.css";

const BookingPage = ({id, firstNamee,surnamee,speciality,docemail, onClose,initialPatientDetails}) => {
  const [patientDetails, setPatientDetails] = useState({
    firstName: '',
    surname: '',
    gender: '',
    phone: '',
    email: '',
    date: '',
    slots: '',
    reason: ''
  });
  

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        // Get the current user
        const currentUser = auth.currentUser;
        const uid = currentUser ? currentUser.uid : null;

        // Log the user UID
       console.log('User UID:', currentUser.uid);

        if (uid) {
          const patientRef = child(databaseRef(database), `users/${uid}`);
          const snapshot = await get(patientRef);

          if (snapshot.exists()) {
            const patientData = snapshot.val();
            setPatientDetails({
              firstName: patientData.firstName || '',
              surname: patientData.surname || '',
              gender: patientData.gender || '',
              phone: patientData.phone || '',
              email: patientData.email || '',
              date: '',
              slots: '',
              reason: ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching patient details:', error.message);
      }
    };

    fetchPatientDetails();
  }, []);

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      // Check for empty fields
      if (!patientDetails.slots || !patientDetails.reason) {
        setBookingError('Please fill in all fields.');
        return;
      }


    try {

      // Create appointment object
      const appointmentData = {
        ...patientDetails,
        patientId:  auth.currentUser ? auth.currentUser.uid : null,
        doctorId: id,
        doctorFirstName: firstNamee,
        doctorSurname: surnamee,
        doctorSpeciality: speciality,
        doctorEmail: docemail,
        status: 'pending',
      };

      // Push appointment data to the database
      const appointmentsRef = databaseRef(database, 'appointments');
      await push(appointmentsRef, appointmentData);

      // Reset form fields and show success message
      setPatientDetails({
        firstName: '',
        surname: '',
        gender: '',
        phone: '',
        email: '',
        date: '',
        slots: '',
        reason: ''
      });
      setBookingSuccess(true);
    
      // Reset success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating appointment:', error.message);
      setBookingError('Error creating appointment. Please try again.');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Optional: Call onClose prop if provided
  };


  return (
    <>
      {isVisible && (
    <div className="booking-container">
        <span className="close"  onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
        </span>
      <h2  style={{ fontFamily: "Lora, serif", color: "#007BFF"}}>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={patientDetails.firstName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            value={patientDetails.surname}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={patientDetails.gender}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={patientDetails.phone}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={patientDetails.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
              Date:
              <input
                type="date"
                name="date"
                value={patientDetails.date}
                onChange={handleInputChange}
              />
            </label>
        <label>
          Slots:
          <select
            name="slots"
            value={patientDetails.slots}
            onChange={handleInputChange}
          >
            <option value="">Select Slot</option>
            <option value="0900-1000">09:00 AM - 10:00 AM</option>
            <option value="1400-1500">02:00 PM - 03:00 PM</option>
            <option value="1700-1800">05:00 PM - 06:00 PM</option>
          </select>
        </label>
        <label>
          Reason:
          <textarea
            name="reason"
            value={patientDetails.reason}
            onChange={handleInputChange}
          ></textarea>
        </label>
        <button type="submit">DONE</button>
      </form>
      {bookingSuccess && <p>Appointment booked successfully!</p>}
      {bookingError && <p>{bookingError}</p>}
    </div>
    )}
    </>
  );
};

export default BookingPage;
