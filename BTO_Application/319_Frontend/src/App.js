import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpage/MainPage';
import IndividualApplicationPage from './mainpage/IndividualApplicationPage';
import LoginPage from './authorization/LoginPage';
import SignUpForm from './authorization/SignUpForm';
import CounselorDashboard from './dashboard/CounselorDashboard';
import ProtectedRoute from "./dashboard/ProtectedRoute";
import SubmitApplication from './submitapplication/SubmitApplication';
import PuantageTable from './common/PuantageTable';
import ChangePassword from "./passwordPages/ChangePassword";
import ForgotPassword from './passwordPages/ForgotPassword';
import ResetPassword from './passwordPages/ResetPassword';
import Statistics from "./statistics/Statistics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Coordinator Page Imports
import CoordinatorLayout from './coordinatorPages/CoordinatorLayout';
import ManagerTourSchedule from './coordinatorPages/ManagerTourSchedule';
import CoordinatorHomepage from './coordinatorPages/CoordinatorHomepage';
import BtoKoordinasyonu from './coordinatorPages/BtoKoordinasyonu';
import OnayBekleyen from './coordinatorPages/OnayBekleyen';
import AddTourGuideForm from './common/AddTourGuideForm';
import AddCoordinatorForm from './common/AddCoordinatorForm';
import AddExecutiveForm from './common/AddExecutiveForm';
import FairSchedule from './common/FairSchedule';
import AllTourApplications from './common/AllTourApplications';
import FairInvitations from './common/FairInvitations';
import Notifications from './common/Notifications';
import CoordinatorNotifications from './notification/NewNotifications';
import CounselorList from './common/CounselorList';
import CoordinatorList from './common/CoordinatorList';
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
import AllFairsBTOManager from "./executivePages/AllFairsBTOManager";
import ExecutiveNotifications from './notification/NewNotifications';
import GeriBildirimlerManagerView from './executivePages/GeriBildirimlerManagerView';
import YaklasanEtkinlikler from './executivePages/YaklasanEtkinlikler';
// TourGuide Page Imports
import TourGuideLayout from './tourguidepages/TourGuideLayout';
import TourGuideHomepage from './tourguidepages/TourGuideHomepage';
import TourGuidePuantage from './tourguidepages/TourGuidePuantage';
import TourEnrollmentPage from './tourguidepages/TourEnrollmentPage';
import TourSchedule from './tourguidepages/TourSchedule';
import TourGuideNotifications from './notification/NewNotifications';

// Advisor Page Imports
import AdvisorLayout from './advisorpages/AdvisorLayout';
import AdvisorHomepage from './advisorpages/AdvisorHomepage';
import AdvisorTourEnrollmentPage from './advisorpages/AdvisorTourEnrollmentPage';
import AdvisorTourSchedule from './advisorpages/AdvisorTourSchedule';
import AdvisorNotifications from './notification/NewNotifications';
import TourWithdrawRequests from './advisorpages/TourWithdrawRequests';
import AdvisorPuantage from './advisorpages/AdvisorPuantage';


import './App.css';
import AllTours from "./tourguidepages/AllTours";
import AllFairs from "./tourguidepages/AllFairs";
import CoordinatorPayments from "./coordinatorPages/CoordinatorPayments";

function App() {
  return (
    <Router>
      <div className="app-container" title="AdayBilgi">
          <ToastContainer position="top-right" autoClose={3000} />
        <header className="app-header"></header>

        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/individual-application" element={<IndividualApplicationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes Wrapper */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/anasayfa" element={<MainPage />} />
                    <Route path="/notifications" element={<Notifications />} />

                    <Route path="/submit-application" element={<SubmitApplication />} />

                    {/* Coordinator Routes Wrapped in CoordinatorLayout */}
                    <Route element={<CoordinatorLayout />}>
                        <Route path="/coordinator-homepage" element={<CoordinatorHomepage />} />
                        <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                        <Route path="/onay-bekleyen-islemler" element={<OnayBekleyen />} />
                        <Route path="/coordinator-tour-schedule" element={<ManagerTourSchedule />} />
                        <Route path="/fuar-takvimi" element={<FairSchedule />} />
                        <Route path="/tur-takvimi" element={<TourSchedule />} />
                        <Route path="/tur-basvurulari" element={<AllTourApplications />} />
                        <Route path="/fuar-davetleri" element={<FairInvitations />} />
                        <Route path="/rehber-ekle"element={<AddTourGuideForm />} />
                        <Route path="/yonetici-ekle"element={<AddExecutiveForm />} />
                        <Route path="/koordinator-ekle" element={<AddCoordinatorForm />} />
                        <Route path="/geribildirimler/coordinator" element={<GeriBildirimlerManagerView />} />
                        <Route path="/coordinator-notifications" element={<CoordinatorNotifications />} />
                        <Route path="/coordinator-change-password" element={<ChangePassword />} />
                        <Route path="/coordinator-statistics" element={<Statistics />} />
                        <Route path="/ödemeler/coordinator" element={<CoordinatorPayments />} />
                    </Route>
                    {/* Executive Routes Wrapped in ExecutiveLayout */}
                    <Route element={<ExecutiveLayout />}>
                        <Route path="/executive-homepage" element={<ExecutiveHomepage />} />
                        <Route path="/onay-bekleyen-islemler/yonetici" element={<OnayBekleyen />} />
                        <Route path="/yaklasan-etkinlikler/yonetici" element={<YaklasanEtkinlikler />} />
                        <Route path="/yaklasan-fuarlar/yonetici" element={<AllFairsBTOManager />} />
                        <Route path="/fuar-takvimi/yonetici" element={<FairSchedule />} />
                        <Route path="/tur-basvurulari/yonetici" element={<AllTourApplications />} />
                        <Route path="/bildirimler/yonetici" element={<ExecutiveNotifications />} />
                        <Route path="/executive-change-password" element={<ChangePassword />} />
                        <Route path="/istatistikler/yonetici" element={<Statistics />} />
                        <Route path="/tur-takvimi/yonetici" element={<ManagerTourSchedule />} />
                       <Route path="/bto-koordinasyonu/yonetici" element={<BtoKoordinasyonu />} />
                       <Route path="/fuar-davetleri/yonetici" element={<FairInvitations />} />
                       <Route path="/geribildirimler/yonetici" element={<GeriBildirimlerManagerView />} />
                    </Route>
                    {/* Counselor Routes Wrapped in CoordinatorLayout */}
                    <Route element={<CounselorLayout />}>
                        <Route path="/applications" element={<CounselorDashboard />} />
                        <Route path="/" element={<CounselorDashboardContent/>}/>
                        <Route path="/counselor-homepage" element={<CounselorHomepage/>}/>
                        <Route path="/create-tour-application" element={<CreateTourApplication/>}/>
                        <Route path="/tour-applications" element={<CounselorTourApplicationsPage/>}/>
                        <Route path="/feedback" element={<FeedbackForm/>}/>
                        <Route path="/my-feedbacks" element={<GeriBildirimler/>}/>
                        <Route path="/tour-application/:id" element={<TourApplicationDetailsPage/>}/>
                        <Route path="/send-fair-invitation" element={<SendFairInvitation/>}/>
                        <Route path="/fair-invitations" element={<FairInvitationsPage/>}/>
                        <Route path="/counselor-notifications" element={<CounselorNotifications />} />
                        <Route path="/counselor-change-password" element={<ChangePassword />} />
                    </Route>
                    {/* TourGuide Routes Wrapped in TourGuide */}
                    <Route element={<TourGuideLayout />}>
                        <Route path="/tur-rehberi-anasayfa" element={<TourGuideHomepage />} />
                        <Route path="/bto-koordinasyonu" element={<BtoKoordinasyonu />} />
                        <Route path="/tourguide-puantage" element={<TourGuidePuantage />} />
                        <Route path="/tourguide-tourschedule" element={<TourSchedule />} />
                        <Route path="/tourguide-tourenrollment" element={<TourEnrollmentPage />} />
                        <Route path="/tourguide-puantage-table" element={<PuantageTable />} />
                        <Route path="/tourguide-notifications" element={<TourGuideNotifications />} />
                        <Route path="/tourguide-change-password" element={<ChangePassword />} />
                        <Route path="/tourguide-all-tours" element={<AllTours />} />
                        <Route path="/tourguide-all-fairs" element={<AllFairs />} />
                        /*<Route path="/geribildirimler" element={<GeriBildirimler />} />*/
                    </Route>

                    {/* Advisor Routes Wrapped in AdvisorLayout */}
                    <Route element={<AdvisorLayout />}>
                        <Route path="/advisor-homepage" element={<AdvisorHomepage />} />
                        <Route path="/advisor-tour-schedule" element={<AdvisorTourSchedule />} />
                        <Route path="/advisor-tourenrollment" element={<AdvisorTourEnrollmentPage />} />
                        <Route path="/withdraw-requests" element={<TourWithdrawRequests />} />
                        <Route path="/advisor-notifications" element={<AdvisorNotifications />} />
                        <Route path="/advisor-change-password" element={<ChangePassword />} />
                        <Route path="/advisor-puantage-table" element={<PuantageTable />} />
                        <Route path="/advisor-puantage" element={<AdvisorPuantage />} />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2024 Bilkent University. All rights reserved.</p>
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
