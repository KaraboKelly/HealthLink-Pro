import React, { useState, useEffect, useRef } from "react";
import { ref as databaseRef, get, child, onValue, set } from 'firebase/database';
import { database } from "../../firebaseconfig";
import Chart from "chart.js/auto";
import "./Nav.css";

const AdminChart = () => {
  const [specialists, setSpecialists] = useState([]);
  const chartRef = useRef(null);

  const fetchSpecialists = async () => {
    try {
      const specialistsRef = child(databaseRef(database), 'specialists');
      const snapshot = await get(specialistsRef);

      if (snapshot.exists()) {
        const specialistsData = [];
        snapshot.forEach((childSnapshot) => {
          const specialist = childSnapshot.val();
          specialistsData.push({
            id: childSnapshot.key,
            firstName: specialist.firstName,
            surname: specialist.surname,
            gender: specialist.gender,
            speciality: specialist.speciality,
            location: specialist.location,
            status: specialist.status || "Pending",
          });
        });
        setSpecialists(specialistsData);
      }
    } catch (error) {
      console.error("Error fetching specialists:", error.message);
    }
  };

  useEffect(() => {
    const specialistsRef = child(databaseRef(database), 'specialists');
    const unsubscribe = onValue(specialistsRef, () => {
      fetchSpecialists();
    });

    return () => unsubscribe();
  }, []);

  // Calculate the count of accepted and pending specialists
  const acceptedCount = specialists.filter(specialist => specialist.status === "Accepted").length;
  const pendingCount = specialists.filter(specialist => specialist.status === "Pending").length;

  useEffect(() => {
    // Render chart
    if (chartRef.current) {
        // If a Chart instance exists, destroy it before rendering a new one
        chartRef.current.destroy();
      }
  
  
    
    const ctx = document.getElementById("specialistsChart");
    chartRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Accepted', 'Pending'],
          datasets: [{
            label: 'Specialists',
            data: [acceptedCount, pendingCount],
            backgroundColor: ['#36a2eb', '#ffcd56'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Specialists Overview',
            },
          },
        },
      });
    }, [acceptedCount, pendingCount]);
  

  return (
    <div className="chart-container">
    <canvas id="specialistsChart" className="pie-chart-wrapper"></canvas>
  </div>
  );
};

export default AdminChart;
