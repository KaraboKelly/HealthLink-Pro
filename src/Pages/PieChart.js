import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "./Admin/Nav.css";

const PieChart = ({ data }) => {
    useEffect(() => {
      if (data) {
        createPieChart(data);
      }
    }, [data]);
  
    function createPieChart(data) {
      const canvas = document.getElementById("pie-chart");
      let pieChart = Chart.getChart(canvas);
  
      if (pieChart) {
        // If a Chart instance exists, destroy it
        pieChart.destroy();
      }
  
      pieChart = new Chart(canvas, {
        type: "doughnut",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: "bottom",
          },
        },
      });
    }
  

  return (
    <div>
      <canvas
       id="pie-chart"
        width="500" 
        height="500" 
        className="pie-chart-wrapper"
        ></canvas>
    </div>
  );
};

export default PieChart;
