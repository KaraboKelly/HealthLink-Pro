import React, { useState } from "react";
import AdminNav from "./Admin/AdminNav";
import Sidebar from "./Admin/Sidebar";
import SpecialistManagement from "./Admin/SpecialistManagement"; 
import AdminChart from "./Admin/AdminChart";
import SpecialistChart from "./Admin/SpecialistChart"; 
import PatientCount from "./Admin/PatientCount";
import Dash from "./Admin/Dash";
import UserCount from "./Admin/UserCount";
import "./Navbar.css";

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <>
      <AdminNav />
      <div className="admin-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleMenuClick={handleMenuClick}
          selectedMenu={selectedMenu}
        />
      

      
      <div className="main-content">
        {/* Card with heading */}
        {selectedMenu === "dashboard" && (
          <div style={{ fontFamily: "Lora, serif", width: "100%", height: "80px", backgroundColor: "#ADD8E6", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "24px" }}>
            ADMIN DASHBOARD
          </div>
          
        )}

{selectedMenu === "dashboard" && (
            <Dash />

          )}



        
          {selectedMenu === "dashboard" && (
            <div className="charts-container">
              <div className="chart-wrapper">
                <AdminChart />
              </div>
              <div className="chart-wrapper">
                <SpecialistChart />
              </div>
            </div>
          )}
          


          {selectedMenu === "specialist" && <SpecialistManagement />}


          {selectedMenu === "appointment" && (
            <h2>Appointments Management</h2>
            
          )}
          {selectedMenu === "analytics" && (
            <h2>Analytics</h2>
          
          )}
          {selectedMenu === "settings" && (
            <h2>Settings</h2>
            
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
