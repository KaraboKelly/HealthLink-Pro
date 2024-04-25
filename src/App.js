import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './Pages/AuthContext'; 
import AdminPage from './Pages/AdminPage';
import SpecialistDetails from './Pages/Admin/SpecialistDetails';
import SpecialistManagement from './Pages/Admin/SpecialistManagement';
import AcceptedSpecialists from './Pages/Admin/AcceptedSpecialists';
import SpecialistApplication from './Pages/SpecialistApplication';
import Homepagee from './Pages/Homepagee';
import HomeSearch from "./Pages/HomeSearch";
import ShowMore from './Pages/ShowMore';
import Register from './Pages/Register';
import PatientPage from './Pages/PatientPage';
import SpecialistPage from './Pages/SpecialistPage';
import SpecialistSignin from './Pages/SpecialistSignin';
import BookingPage from './Pages/BookingPage';
import LobbyPage from './Pages/LobbyPage';
import VideoChat from './Pages/VideoChat';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Homepagee/>} />
        <Route path="/specialist-details/:id" element={<SpecialistDetails />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/specialist-management" element={<SpecialistManagement/>} />
        <Route path="/accepted-specialists" element={<AcceptedSpecialists />} />
        <Route path="/specialist-registration" element={<SpecialistApplication/>} />
        <Route path="/home-search" element={<HomeSearch/>} />
        <Route path="/show-more/:id" element={< ShowMore />} />
        <Route path="/register" element={< Register />} />
        <Route path="/patient-page" element={< PatientPage />} />
        <Route path="/specialist-page" element={< SpecialistPage />} />
        <Route path="/specialist-signin" element={< SpecialistSignin />} />
        <Route path="/booking/:uid" element={<BookingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/videochat" element={<VideoChat />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
