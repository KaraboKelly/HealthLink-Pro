import React, { useState, useEffect, useRef } from "react";
import { ref as databaseRef, get, child, onValue } from 'firebase/database';
import { database } from "../../firebaseconfig";
import Chart from "chart.js/auto";
import "./Nav.css";

const SpecialistChart = () => {
  const [specialtyCounts, setSpecialtyCounts] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAcceptedSpecialists = async () => {
      try {
        const specialistsRef = child(databaseRef(database), 'specialists');
        const snapshot = await get(specialistsRef);

        if (snapshot.exists()) {
          const specialties = {};
          snapshot.forEach((childSnapshot) => {
            const specialist = childSnapshot.val();
            if (specialist.status === "Accepted" && specialist.speciality) {
              const speciality = specialist.speciality;
              specialties[speciality] = (specialties[speciality] || 0) + 1;
            }
          });
          setSpecialtyCounts(specialties);
        }
      } catch (error) {
        console.error("Error fetching accepted specialists:", error.message);
      }
    };

    fetchAcceptedSpecialists();
  }, []);

  useEffect(() => {
    // Render chart
    if (chartRef.current) {
      // If a Chart instance exists, destroy it before rendering a new one
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("specialistChart");
    const specialityLabels = Object.keys(specialtyCounts);
    const specialityData = Object.values(specialtyCounts);
    const colors = generateColors(specialityLabels.length);



    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: specialityLabels,
        datasets: [{
          label: 'Number of Specialists',
          data: specialityData,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        }],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Number of Available Specialists'
        },
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: Math.max(...specialityData) + 1,
            stepSize: 1,
            precision: 0,
            title: {
              display: true,
              text: 'Number of Specialists'
            }
          }
        }
      }
    });
  }, [specialtyCounts]);

  // Function to generate random colors
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
    }
    return colors;
  };


  return (
    <div className="specialistChart-container">
      <canvas id="specialistChart" className="bar-chart-wrapper"></canvas>
    </div>
  );
};


export default SpecialistChart;
