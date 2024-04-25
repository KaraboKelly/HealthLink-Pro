// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBMZuV7cZcapy0fo-4BSBRGQs_RQl6TR-U",
  authDomain: "healthlink-6eab5.firebaseapp.com",
  databaseURL:"https://healthlink-6eab5-default-rtdb.firebaseio.com",
  projectId: "healthlink-6eab5",
  storageBucket: "healthlink-6eab5.appspot.com",
  messagingSenderId: "365158816071",
  appId: "1:365158816071:web:02618e142821b2efc11462",
  measurementId: "G-B93XGPQXGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database= getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage};


