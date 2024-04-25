// SpecialistSection.jsx
import React from "react";

const SpecialistSection = () => {
  const specialistData = [
    { type: "Cardiologist", description: "Heart Specialists", color: "#FF5733" },
    { type: "Dermatologist", description: "Skin Specialists", color: "#33FF57" },
    { type: "Ophthalmologist", description: "Eye Specialists", color: "#3385FF" },
    { type: "Orthopedic Surgeon", description: "Bone and Joint Specialists", color: "#FF33E6" },
    { type: "Gastroenterologist", description: "Digestive System Specialists", color: "#FFD733" },
    { type: "Neurologist", description: "Nervous System Specialists", color: "#FF336E" },
    { type: "Pediatrician", description: "Children's Health Specialists", color: "#33FFB2" },
    { type: "Endocrinologist", description: "Hormone Specialists", color: "#FF8C33" },
    { type: "Pulmonologist", description: "Respiratory System Specialists", color: "#FF44E3" },
    { type: "Rheumatologist", description: "Autoimmune Disease Specialists", color: "#44FFD6" },
    { type: "Hematologist", description: "Blood Specialists", color: "#FF4444" },
    { type: "Psychiatrist", description: "Mental Health Specialists", color: "#88FF44" },
    { type: "Gynecologist", description: "Women's Health Specialists", color: "#FF33D1" },
    { type: "Nephrologist", description: "Kidney Specialists", color: "#3366FF" },
    { type: "Dentist", description: "Oral Health Specialists", color: "#3385FF" },
    { type: "Urologist", description: "Urinary System Specialists", color: "#33FFD7" }, 
    // Add more specialist types with their descriptions and colors
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2 style={{ fontSize: "3em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 700 }}>
        Available Specialists
      </h2>
      <p style={{ fontSize: "1.6em", color: "#007BFF", fontFamily: "Lora, serif", fontWeight: 500 }}>
        Explore the types of specialists available on our platform.
      </p>
      {/* Specialist Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "40px", marginBottom:"300px" }}>
        {specialistData.map((specialist, index) => (
          <div key={index} style={{ width: "400px", margin: "10px", padding: "20px", backgroundColor: specialist.color, borderRadius: "10px" }}>
            <h3 style={{ fontSize: "2em", color: "#FFFFFF", fontFamily: "Lora, serif", fontWeight: 700 }}>
              {specialist.type}
            </h3>
            <p style={{ fontSize: "1.5em", color: "#FFFFFF" }}>{specialist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialistSection;

