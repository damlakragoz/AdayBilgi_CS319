import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpage/MainPage';
import SignUpForm from './authorization/SignUpForm';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from "./dashboard/ProtectedRoute";
import SubmitApplication from './submitapplication/SubmitApplication';  // Import the new page
import CoordinatorHomepage from './coordinatorPages/CoordinatorHomepage';
import TourGuideHomepage from './tourguidepages/TourGuideHomepage';
import TourGuidePuantage from './tourguidepages/TourGuidePuantage';
import BtoKoordinasyonu from './coordinatorPages/BtoKoordinasyonu';
import LoginPage from './authorization/LoginPage';
import TourSchedule from './common/TourSchedule';
import TourEnrollmentPage from './tourguidepages/TourEnrollmentPage';
import Notifications from './common/Notifications';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header"></header>

        <main className="app-main">
          <Routes>
            {/* Default route set to MainPage */}
            <Route path="/" element={<MainPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/tour-schedule" element={<TourSchedule />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/submit-application" element={<SubmitApplication />} />
            <Route path="/tourguide-tourenrollment" element={<TourEnrollmentPage />} />
            <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />
            <Route path="/tourguide-homepage" element={<TourGuideHomepage />} />
            <Route path="/tourguide-puantage" element={<TourGuidePuantage />} />
            <Route path="/tourguide-tourschedule" element={<TourSchedule />} />
            <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
            <Route path="/login" element={<LoginPage />} />
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
