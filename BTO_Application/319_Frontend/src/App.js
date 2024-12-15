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
import OnayBekleyen from './coordinatorPages/OnayBekleyen';
import CoordinatorLayout from './coordinatorPages/CoordinatorLayout'; // Imported CoordinatorLayout
import TourSchedule from './common/TourSchedule';
import FairSchedule from './common/FairSchedule';
import TourApplications from './common/TourApplications';
import FairInvitations from './common/FairInvitations';
import Notifications from './common/Notifications';
import NewNotifications from './notification/NewNotifications';
import CounselorList from './common/CounselorList';
import TourGuideHomepage from './tourguidepages/TourGuideHomepage';
import TourGuidePuantage from './tourguidepages/TourGuidePuantage';
import TourEnrollmentPage from './tourguidepages/TourEnrollmentPage';
//Counselor Page Imports
import CounselorHomepage from './counselorPages/CounselorHomepage';
import GeriBildirimler from './counselorPages/GeriBildirimler';
import CounselorDashboardContent from "./counselorPages/CounselorDashboardContent";
import FeedbackForm from "./counselorPages/FeedbackForm";
import CounselorTourApplicationsPage from "./counselorPages/CounselorTourApplicationsPage";
import CreateTourApplication from "./counselorPages/CreateTourApplication";
import TourApplicationDetailsPage from "./counselorPages/TourApplicationDetailsPage";
import SendFairInvitation from "./counselorPages/SendFairInvitation";
import FairInvitationsPage from "./counselorPages/FairInvitationsPage";
import CounselorLayout from "./counselorPages/CounselorLayout";
//Executive Page Imports
import ExecutiveHomepage from './executivePages/ExecutiveHomepage';
import ExecutiveLayout from "./executivePages/ExecutiveLayout";

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

              {/* Protected Routes Wrapper */}
              <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Routes>
                        <Route path="/anasayfa" element={<MainPage />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/tur-takvimi" element={<TourSchedule />} />
                        <Route path="/tur-basvurulari" element={<TourApplications />} />
                        <Route path="/fuar-takvimi" element={<FairSchedule />} />
                        <Route path="/fuar-davetleri" element={<FairInvitations />} />
                        <Route path="/applications" element={<Dashboard />} />
                        <Route path="/submit-application" element={<SubmitApplication />} />

                        {/* Coordinator Routes Wrapped in CoordinatorLayout */}
                        <Route element={<CoordinatorLayout />}>
                          <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />
                          <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                          <Route path="/onay-bekleyen-islemler" element={<OnayBekleyen />} />
                        </Route>

                        {/* Counselor Routes Wrapped in CoordinatorLayout */}
                        <Route element={<CounselorLayout />}>
                          <Route path="/" element={<CounselorDashboardContent/>}/>
                          <Route path="/counselor-homepage" element={<CounselorHomepage/>}/>
                          <Route path="/create-tour-application" element={<CreateTourApplication/>}/>
                          <Route path="/tour-applications" element={<CounselorTourApplicationsPage/>}/>
                          <Route path="/feedback" element={<FeedbackForm/>}/>
                          <Route path="/tour-application/:id" element={<TourApplicationDetailsPage/>}/>
                          <Route path="/send-fair-invitation" element={<SendFairInvitation/>}/>
                          <Route path="/fair-invitations" element={<FairInvitationsPage/>}/>
                          <Route path="/new-notifications" element={<NewNotifications />} />
                        </Route>

                        {/* Counselor Routes Wrapped in CoordinatorLayout */}
                        <Route element={<ExecutiveLayout />}>
                          <Route path="/executive-homepage" element={<ExecutiveHomepage />} />

                        </Route>

                        <Route path="/tur-rehberi-anasayfa" element={<TourGuideHomepage />} />
                        <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                        <Route path="/tourguide-puantage" element={<TourGuidePuantage />} />
                        <Route path="/tourguide-tourschedule" element={<TourSchedule />} />
                        <Route path="/tourguide-tourenrollment" element={<TourEnrollmentPage />} />
                        <Route path="/geribildirimler" element={<GeriBildirimler />} />


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