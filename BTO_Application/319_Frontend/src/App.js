import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpage/MainPage';
import LoginPage from './authorization/LoginPage';
import SignUpForm from './authorization/SignUpForm';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from "./dashboard/ProtectedRoute";
import SubmitApplication from './submitapplication/SubmitApplication';

// Coordinator Page Imports
import CoordinatorLayout from './coordinatorPages/CoordinatorLayout';
import ManagerTourSchedule from './coordinatorPages/ManagerTourSchedule';
import CoordinatorHomepage from './coordinatorPages/CoordinatorHomepage';
import BtoKoordinasyonu from './coordinatorPages/BtoKoordinasyonu';
import OnayBekleyen from './coordinatorPages/OnayBekleyen';
import AddTourGuideForm from './common/AddTourGuideForm';
import FairSchedule from './common/FairSchedule';
import AllTourApplications from './common/AllTourApplications';
import FairInvitations from './common/FairInvitations';
import Notifications from './common/Notifications';
import CoordinatorNotifications from './notification/NewNotifications';
import CounselorList from './common/CounselorList';
// Counselor Page Imports
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
import CounselorNotifications from './notification/NewNotifications';
// Executive Page Imports
import ExecutiveHomepage from './executivePages/ExecutiveHomepage';
import ExecutiveLayout from "./executivePages/ExecutiveLayout";
import ExecutiveNotifications from './notification/NewNotifications';
// TourGuide Page Imports
import TourGuideLayout from './tourguidepages/TourGuideLayout';
import TourGuideHomepage from './tourguidepages/TourGuideHomepage';
import TourGuidePuantage from './tourguidepages/TourGuidePuantage';
import TourEnrollmentPage from './tourguidepages/TourEnrollmentPage';
import TourSchedule from './tourguidepages/TourSchedule';
import TourGuideNotifications from './notification/NewNotifications';

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

                    <Route path="/applications" element={<Dashboard />} />
                    <Route path="/submit-application" element={<SubmitApplication />} />

                    {/* Coordinator Routes Wrapped in CoordinatorLayout */}
                    <Route element={<CoordinatorLayout />}>
                      <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />
                      <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                      <Route path="/onay-bekleyen-islemler" element={<OnayBekleyen />} />
                      <Route path="/coordinator-tour-schedule" element={<ManagerTourSchedule />} />
                      <Route path="/fuar-takvimi" element={<FairSchedule />} />
                      <Route path="/tur-basvurulari" element={<AllTourApplications />} />
                      <Route path="/fuar-davetleri" element={<FairInvitations />} />
                      <Route path="/add-tourguide" element={<AddTourGuideForm />} />
                        <Route path="/coordinator-notifications" element={<CoordinatorNotifications />} />
                    </Route>
                    {/* Executive Routes Wrapped in ExecutiveLayout */}
                    <Route element={<ExecutiveLayout />}>
                        <Route path="/executive-homepage" element={<ExecutiveHomepage />} />
                        <Route path="/exec-onay-bekleyen-islemler" element={<OnayBekleyen />} />
                        <Route path="/executive-notifications" element={<ExecutiveNotifications />} />
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
                        <Route path="/counselor-notifications" element={<CounselorNotifications />} />
                    </Route>
                    {/* TourGuide Routes Wrapped in TourGuide */}
                    <Route element={<TourGuideLayout />}>
                        <Route path="/tur-rehberi-anasayfa" element={<TourGuideHomepage />} />
                        <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                        <Route path="/tourguide-puantage" element={<TourGuidePuantage />} />
                        <Route path="/tourguide-tourschedule" element={<TourSchedule />} />
                        <Route path="/tourguide-tourenrollment" element={<TourEnrollmentPage />} />
                        <Route path="/tourguide-notifications" element={<TourGuideNotifications />} />
                        /*<Route path="/geribildirimler" element={<GeriBildirimler />} />*/
                    </Route>

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
