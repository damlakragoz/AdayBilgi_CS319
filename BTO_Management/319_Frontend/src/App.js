import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpage/MainPage';
import SignUpForm from './authorization/SignUpForm';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from "./dashboard/ProtectedRoute";
import SubmitApplication from './submitapplication/SubmitApplication';  // Import the new page
import CoordinatorHomepage from './coordinatorPages/CoordinatorHomepage';
import BtoKoordinasyonu from './coordinatorPages/BtoKoordinasyonu';
import LoginPage from './authorization/LoginPage';
import TourSchedule from './common/TourSchedule';
import Notifications from './common/Notifications';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">

        </header>

        <main className="app-main">
          {/* React Router will control which component is displayed based on the URL */}
          <Routes>
            <Route path="/" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/tour-schedule" element={<TourSchedule />} />
            <Route path="/signup" element={<SignUpForm />} />
            {/* Wrap the Dashboard route in ProtectedRoute */}
            <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
            />
            <Route path="/submit-application" element={<SubmitApplication />} />  {/* New Route */}
            <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />  {/* New Route */}
            <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />  {/* New Route */}
            <Route path="/login" element={<LoginPage />} />  {/* New Route */}

          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2023 Bilkent University. All rights reserved.</p>
          <div>
            <a href="#privacy">Privacy Policy</a> |
            <a href="#terms">Terms of Service</a> |
            <a href="#contact">Contact Us</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
