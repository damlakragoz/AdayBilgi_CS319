import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./counselorPages/Sidebar";
import Header from "./counselorPages/Header";
import CounselorDashboardContent from "./counselorPages/CounselorDashboardContent";
import FeedbackForm from "./counselorPages/FeedbackForm";
import CounselorTourApplicationsPage from "./counselorPages/CounselorTourApplicationsPage";
import CreateTourApplication from "./counselorPages/CreateTourApplication";
import TourApplicationDetailsPage from "./counselorPages/TourApplicationDetailsPage";
import SendFairInvitation from "./counselorPages/SendFairInvitation";
import FairInvitationsPage from "./counselorPages/FairInvitationsPage";
import "./App.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
      <Router>
        <Header toggleSidebar={toggleSidebar} />
        <div className="d-flex">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div
              className={`content-container flex-grow-1 ${sidebarOpen ? "with-sidebar" : ""}`}
          >

            <Routes>
              <Route path="/" element={<CounselorDashboardContent/>}/>
              <Route path="/create-tour-application" element={<CreateTourApplication/>}/>
              <Route path="/tour-applications" element={<CounselorTourApplicationsPage/>}/>
              <Route path="/feedback" element={<FeedbackForm/>}/>
              <Route path="/tour-application/:id" element={<TourApplicationDetailsPage/>}/>
              <Route path="/send-fair-invitation" element={<SendFairInvitation/>}/>
              <Route path="/fair-invitations" element={<FairInvitationsPage/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
};

export default App;