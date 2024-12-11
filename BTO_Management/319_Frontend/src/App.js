import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpage/MainPage';
import LoginPage from './authorization/LoginPage';
import SignUpForm from './authorization/SignUpForm';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from "./dashboard/ProtectedRoute";
import SubmitApplication from './submitapplication/SubmitApplication';
import CoordinatorHomepage from './coordinatorPages/CoordinatorHomepage';
import BtoKoordinasyonu from './coordinatorPages/BtoKoordinasyonu';
import TourSchedule from './common/TourSchedule';
import FairSchedule from './common/FairSchedule';
import TourApplications from './common/TourApplications';
import PuantageTable from './common/PuantageTable';
import FairInvitations from './common/FairInvitations';
import Notifications from './common/Notifications';
import TourGuideHomepage from './tourguidepages/TourGuideHomepage';
import TourGuidePuantage from './tourguidepages/TourGuidePuantage';
import TourEnrollmentPage from './tourguidepages/TourEnrollmentPage';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header"></header>

        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/puantage-table" element={<PuantageTable />} />

            {/* Protected Routes Wrapper */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/tur-takvimi" element={<TourSchedule />} />
                    <Route path="/tur-basvurulari" element={<TourApplications />} />
                    <Route path="/fuar-takvimi" element={<FairSchedule />} />
                    <Route path="/fuar-davetleri" element={<FairInvitations />} />
                    <Route path="/applications" element={<Dashboard />} />
                    <Route path="/submit-application" element={<SubmitApplication />} />
                    <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />
                    <Route path="/tur-rehberi-anasayfa" element={<TourGuideHomepage />} />
                    <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                    <Route path="/tourguide-puantage" element={<TourGuidePuantage />} />
                    <Route path="/tourguide-tourschedule" element={<TourSchedule />} />
                    <Route path="/tourguide-tourenrollment" element={<TourEnrollmentPage />} />

                  </Routes>
                </ProtectedRoute>
              }
            />
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
