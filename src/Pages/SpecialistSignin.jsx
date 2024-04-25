import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebaseconfig";
import { ref, get } from "firebase/database";
import './SpecialistReg.css';
import hlogo from '../images/hlogo.png'; 
import pic from '../images/signin.jpg'; 

const SpecialistSignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully!");

      if (user.email === "admin@gmail.com") { 
        // Redirect the admin to the admin page
        window.location.href = '/admin';
    } else {
      // Fetch user data from Firebase Realtime Database
      const userRef = ref(database, `specialists/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const specialistData = snapshot.val();
        // Displaying the specialist data
        console.log("Specialist data:", specialistData);
      } else {
        console.error("Specialist data not found.");
      }

      // Redirect the specialist 
      window.location.href = '/specialist-page';
    } 
}catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="left-container">
        <img src={pic} alt="Sign In" className="signin-image" />
      </div>
      <div className="right-container">
          <img src={hlogo} alt="Logo" className="logo" style={{height:'140px',width:'200px',marginLeft:'90px'}} />
      <form onSubmit={handleSignIn}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      </div>
      </div>
  );
};

export default SpecialistSignInForm;
