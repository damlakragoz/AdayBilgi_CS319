import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import CounselorList from "../common/CounselorList";
import TourGuideList from "../common/TourGuideList";
import "./BTOKoordinasyonu.css";

const BtoKoordinasyonu = ({ data = [], itemsPerPage = 5 }) => {
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
      <h1>BTO Koordinasyonu</h1>

      {/* Conditional Rendering Based on Current Page with Transitions */}
      <CSSTransition
        in={currentPage === 1}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h2>Tur Rehberleri</h2>
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
          <h2>Rehber Öğretmenler</h2>
          <CounselorList />
        </div>
      </CSSTransition>

      <CSSTransition
        in={currentPage === 3}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          <h2>Yeni Açılan Koordinatör Hesapları</h2>
          {/* Add content for this page if needed */}
        </div>
      </CSSTransition>

      {/* Navigation Buttons */}
      <div className="page-navigation">
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          Tur Rehberleri
        </button>
        <button onClick={() => goToPage(2)} disabled={currentPage === 2}>
          Rehber Öğretmenler
        </button>
        <button onClick={() => goToPage(3)} disabled={currentPage === 3}>
          Yeni Hesaplar
        </button>
      </div>
    </div>
  );
};

// Default Props
BtoKoordinasyonu.defaultProps = {
  data: [],
  itemsPerPage: 5,
};

export default BtoKoordinasyonu;
