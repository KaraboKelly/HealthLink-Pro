import React, { useState } from 'react';
import { ref , set } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebaseconfig';
import './SpecialistReg.css';
import logoImage from '../images/hlogo.png';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


const SpecialistApplication = () => {
  const auth = getAuth();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [qualification, setQualification] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [educationBackground, setEducationBackground] = useState('');
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [medicalLicenses, setMedicalLicenses] = useState('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

       // Check if passwords match
    if (password === confirmPassword) {
      setPasswordsMatch(true);

    try {
      // Create a new specialist user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Upload passport photo to Firebase Storage
      const passportPhotoRef = storageRef(storage, `passport-photos/${user.uid}`);
      const passportPhotoSnapshot = passportPhoto
        ? await uploadBytesResumable(passportPhotoRef, passportPhoto)
        : null;

      // Upload medical licenses to Firebase Storage
      const medicalLicensesRef = storageRef(storage, `medical-licenses/${user.uid}`);
      const medicalLicensesSnapshot = medicalLicenses
        ? await uploadBytesResumable(medicalLicensesRef, medicalLicenses)
        : null;

      // Update the specialist data in the Realtime Database with the download URLs
      const specialistRef = ref(database, `specialists/${user.uid}`);
      await set(specialistRef, {
        firstName,
        surname,
        gender,
        dob,
        email,
        phone,
        speciality,
        qualification,
        language,
        location,
        educationBackground,
        yearsOfExperience,
        passportPhotoUrl: passportPhotoSnapshot
          ? await getDownloadURL(passportPhotoSnapshot.ref)
          : null,
        medicalLicensesUrl: medicalLicensesSnapshot
          ? await getDownloadURL(medicalLicensesSnapshot.ref)
          : null,
        status: 'Pending',
      });

      // Clear form fields and file inputs
      clearForm();

      setSubmissionStatus('success'); // Set success status
        window.location.href = '/specialist-signin';
      } catch (error) {
        setSubmissionStatus('error');
        console.error('Error submitting specialist application:', error);
      }
    } else {
      setPasswordsMatch(false);
    }
  };

  const clearForm = () => {
    // Clear form fields
    setFirstName('');
    setSurname('');
    setGender('');
    setDob('');
    setEmail('');
    setPhone('');
    setSpeciality('');
    setQualification('');
    setLanguage('');
    setLocation('');
    setYearsOfExperience('');
    setEducationBackground('');
    setPassportPhoto(null);
    setMedicalLicenses('');
    setPassword('');
    setConfirmPassword('');

    // Clear file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = ''; // Reset file input value
    });

    // Clear number input values
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach((input) => {
      input.value = ''; // Reset number input value
    });
  };
        

  return (
    <div className="specialist-application-page">
    <div style={{ maxWidth: '700px' }} className="container">
      <form onSubmit={handleSubmit}>
        <img src={logoImage} alt="Logo" style={{ width: '190px',heigtht:'180px', marginTop: '2px',marginLeft: '250px' }} />
        <div className="title">Specialist Registration</div>
  
        <div className="input-row">
          <label>
            First Name:
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
  
          <label>
            Surname:
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
  
          <label>
            Date Of Birth:
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
  
          <label>
            Phone:
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Speciality:
            <input type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} required />
          </label>
  
          <label>
            Latest Qualification:
            <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Language(s):
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
          </label>
  
          <label>
            Current Location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Passport Photo:
            <input type="file" 
            accept="image/*"
            onChange={(e) => setPassportPhoto(e.target.files[0])} />
          </label>
  
          <label>
            Years of Experience:
            <input type="number" value={yearsOfExperience}  min="0" onChange={(e) => setYearsOfExperience(e.target.value)} required  />
          </label>
        </div>
  
        <div className="input-row">
          <label>
            Copy of Medical Licenses:
            <input type="file" 
            accept=".pdf"
            onChange={(e) => setMedicalLicenses(e.target.files[0])}
             />
          </label>
  
          <label>
            Education Background:
            <textarea rows="4" value={educationBackground} 
            onChange={(e) => setEducationBackground(e.target.value)}
           ></textarea>
          </label>
        </div>

        <div className="input-row">
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            Confirm Password:
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required  />
          </label>
        </div>
         {/* Display password match error */}
         {!passwordsMatch && (
          <div className="error-message">Passwords do not match. Please enter matching passwords.</div>
        )}


  
        <div className="button">
          <input type="submit" value="SUBMIT" />
        </div>

        {/* Display success or error message */}
        {submissionStatus === 'success' && (
          <div className="success-message">Specialist application submitted successfully!</div>
        )}
        {submissionStatus === 'error' && (
          <div className="error-message">Error submitting specialist application. Please try again.</div>
        )}
         
      </form>
    </div>
    </div>
  );
  };  

export default SpecialistApplication;
