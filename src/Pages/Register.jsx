import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import * as Components from './Components';
import { auth, database, storage } from "../firebaseconfig";
import { ref, set, get } from 'firebase/database';
import { useAuth } from './AuthContext';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword ,updateProfile} from "firebase/auth";
import hlogo from '../images/hlogo.png';

function Register() {
    const [signIn, toggle] = React.useState(true);
    const [name, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSignUp = async (e) => {
        e.preventDefault();

        // Check if passwords match
    if (password === confirmPassword) {
        setPasswordsMatch(true);
    
        try {
          // Create a new user with email and password
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
         
          // Upload profile photo to Firebase Storage
      const storageReference = storageRef(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageReference, profilePhotoFile);


      //Get the download URL of the uploaded photo
      const downloadURL = await getDownloadURL(storageReference);

      // Store additional details in Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        firstName: name,
        surname: surname,
        email: user.email,
        phone: phone,
        gender: gender,
        dob: dob,
        profilePhotoUrl: downloadURL,
      });

      // Update user profile in Firebase Authentication with photo URL
      await updateProfile(user, {
        displayName: `${name} ${surname}`,
        photoURL: downloadURL,
      });

      console.log('User registered successfully!');

      //Reset the form fields upon successful registration
      setFirstName('');
      setSurname('');
      setEmail('');
      setPassword('');
      setGender('');
      setDob('');
      setPhone('');
      setConfirmPassword('');
      setProfilePhotoFile(null);



          // Set registration success state to true
          setRegistrationSuccess(true);
        } catch (error) {
          console.error("Error registering user:", error.message);
          // Handle the error, display a message, or perform other actions
        }
    }   else {
      setPasswordsMatch(false);
        }
      };


    
      const handleSignIn = async (e) => {
        e.preventDefault();
      
        let userEmail; // Declare userEmail outside the try block
      
        try {
          // Capture email and password from input fields
          const userPassword = password;
          userEmail = email.trim();
      
          // Sign in with email and password
    const { user } = await signInWithEmailAndPassword(auth, userEmail, userPassword); 
    console.log("User signed in successfully!");
         
          // Fetch user data from Firebase Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Now you have access to the user's data, which you can use to populate the page
      console.log("User data:", userData);

       // Call the login function to set the authentication state
       login(userData);

       navigate("/");

    } else {
      console.error("User data not found.");
    }
   
        } catch (error) {
          console.error("Error signing in:", error.message);
      
          // Handle the error, display a message, or perform other actions
          console.error('Full error:', error);
      
          // Check if the error includes the email causing the issue
          if (error.code === 'auth/invalid-email') {
            console.error('Invalid email:', userEmail);
          }
        }
      };
      
      const handleSignInClick = () => {
      
    navigate("/register");
  };


     return(
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
             <Components.Form onSubmit={handleSignUp}>

                     <Components.Title>Create Account</Components.Title>
                     <Components.Input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Components.Input
            type="surname"
            placeholder="Last Name"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Components.Input
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
            <Components.Input
        type="date" 
        placeholder="Date of Birth"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <Components.Input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
          <Components.Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Components.Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Components.Input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhotoFile(e.target.files[0])}
              />
          {!passwordsMatch && (
            <Components.ErrorText>Passwords do not match</Components.ErrorText>
          )}
          <Components.Button type="submit">Sign Up</Components.Button>
          {registrationSuccess && (
          <Components.SuccessText>
            You have successfully registered, now you can sign in.
          </Components.SuccessText>
        )}
        </Components.Form>
      </Components.SignUpContainer>

             <Components.SignInContainer signinIn={signIn}>
             <Components.Form onSubmit={handleSignIn}>
                      <Components.Title>Sign in</Components.Title>
                      <Components.Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                      <Components.Input type='password' placeholder='Password'  value={password}  onChange={(e) => setPassword(e.target.value)}/>
                      <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                      <Components.Button onChange={handleSignInClick}>Sign In</Components.Button>
                      {/* Clickable words to redirect */}
    <span onClick={() => window.location.href = '/specialist-signin'} style={{ cursor: 'pointer', color: 'lightblue', textDecoration: 'underline', marginTop: '10px', display: 'block' }}>Specialist Signin</span>
                  </Components.Form>
             </Components.SignInContainer>

             <Components.OverlayContainer signinIn={signIn}>
                 <Components.Overlay signinIn={signIn}>

                 <Components.LeftOverlayPanel signinIn={signIn}>
                 <Components.Logo src={hlogo} alt="Logo" />
                     <Components.Title>HealthLink Pro</Components.Title>
                     <Components.Paragraph>
                         Do you already have an account?Sign in here!
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Sign In
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel signinIn={signIn}>
                     <Components.Logo src={hlogo} alt="Logo" />
                       <Components.Title>Good, Day!</Components.Title>
                       <Components.Paragraph>
                           If you have'nt registered with us yet,sign up here!
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Sign Up
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>

         </Components.Container>
     )
}

export default Register;