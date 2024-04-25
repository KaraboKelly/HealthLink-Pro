import React, { useState, useEffect } from "react";
import { ref as databaseRef, get, child } from 'firebase/database';
import { database } from "../../firebaseconfig"; 
import "./Nav.css";

const UserCount = () => {
    const [registeredUsersCount, setRegisteredUsersCount] = useState(0);

    const getRegisteredUsersCount = async () => {
        try {
            const usersRef = child(databaseRef(database), 'users'); // Reference to the "users" node
            const specialistsRef = child(databaseRef(database), 'specialists'); // Reference to the "specialists" node
            
            const usersSnapshot = await get(usersRef);
            const specialistsSnapshot = await get(specialistsRef);
      
            let usersCount = 0;
            let specialistsCount = 0;

            // Count the number of users
            usersSnapshot.forEach(() => {
                usersCount++;
            });

            // Count the number of specialists
            specialistsSnapshot.forEach(() => {
                specialistsCount++;
            });

            const totalCount = usersCount + specialistsCount;
      
        setRegisteredUsersCount(totalCount);
        } catch (error) {
          console.error("Error retrieving registered users:", error.message);
        }
    };
      
    useEffect(() => {
      getRegisteredUsersCount();
    }, []);
  
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Total Users</h5>
          <p className="card-text">{registeredUsersCount}</p>
        </div>
      </div>
    );
  };

  export default UserCount;