import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./CounselorSidebar";
import CounselorHeader from "./CounselorHeader";
import CounselorDashboardContent from "./CounselorDashboardContent";
import FeedbackForm from "./FeedbackForm";
import CounselorTourApplicationsPage from "./CounselorTourApplicationsPage";
import CreateTourApplication from "./CreateTourApplication";
import TourApplicationDetailsPage from "./TourApplicationDetailsPage";
import SendFairInvitation from "./SendFairInvitation";
import FairInvitationsPage from "./FairInvitationsPage";

const CounselorHomepage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <CounselorHeader toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`content-container flex-grow-1 ${sidebarOpen ? "with-sidebar" : ""}`}
        >
          fkgllfadj
        </div>
      </div>
    </div>
  );
};

export default CounselorHomepage;
