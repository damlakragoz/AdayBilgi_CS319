import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import CounselorList from "../common/CounselorList";
import TourGuideList from "../common/TourGuideList";
import ExecutiveList from "../common/ExecutiveList";
import CoordinatorList from "../common/CoordinatorList";
import "../coordinatorPages/BTOKoordinasyonu.css";

const AdminDashboard = ({ data = [], itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Page Changes
  const goToPage = (page) => setCurrentPage(page);

  // Action Handlers for Table Buttons
  const handleApprove = (id) => alert(`Approved ID: ${id}`);
  const handleReject = (id) => alert(`Rejected ID: ${id}`);
  const handleViewDetails = (id) => alert(`Viewing details for ID: ${id}`);

  // Table Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="bto-container">
      <h2>Admin Sayfası</h2>

      {/* Conditional Rendering Based on Current Page with Transitions */}
      <CSSTransition
        in={currentPage === 1}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h3>Tur Rehberleri</h3>
          <TourGuideList />
        </div>
      </CSSTransition>

      <CSSTransition
        in={currentPage === 2}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h3>Rehber Öğretmenler</h3>
          <CounselorList />
        </div>
      </CSSTransition>

      <CSSTransition
        in={currentPage === 4}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h3>Koordinatörler</h3>
            <CoordinatorList />
        </div>
      </CSSTransition>

      <CSSTransition
        in={currentPage === 3}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h3>Yöneticiler</h3>
            <ExecutiveList />
        </div>
      </CSSTransition>


      {/* Navigation Buttons */}
      <div className="page-navigation">
        <button className="filter-button" onClick={() => goToPage(1)} disabled={currentPage === 1}>
          Tur Rehberleri
        </button>
        <button className="filter-button" onClick={() => goToPage(2)} disabled={currentPage === 2}>
          Rehber Öğretmenler
        </button>
        <button className="filter-button" onClick={() => goToPage(3)} disabled={currentPage === 3}>
          Koordinatörler
        </button>
        <button className="filter-button" onClick={() => goToPage(4)} disabled={currentPage === 4}>
          Yöneticiler
        </button>
      </div>
    </div>
  );
};

// Default Props
AdminDashboard.defaultProps = {
  data: [],
  itemsPerPage: 5,
};

export default AdminDashboard;
