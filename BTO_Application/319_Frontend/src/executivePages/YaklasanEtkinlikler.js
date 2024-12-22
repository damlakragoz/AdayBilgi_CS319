import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import CounselorList from "../common/CounselorList";
import TourGuideList from "../common/TourGuideList";
import ExecutiveList from "../common/ExecutiveList";
import CoordinatorList from "../common/CoordinatorList";
import ManagerTourSchedule from '../coordinatorPages/ManagerTourSchedule';
import Fuarlarim from "../executivePages/Fuarlarim";
import "../coordinatorPages/BTOKoordinasyonu.css";
import AllFairsBTOManager from "./AllFairsBTOManager";

const YaklasanEtkinlikler = ({ data = [], itemsPerPage = 5 }) => {
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
      <h2>Yaklaşan Etkinlikler</h2>

      {/* Navigation Buttons at the Top */}
      <div className="page-navigation">
        <button className="filter-button" onClick={() => goToPage(1)} disabled={currentPage === 1}>
          Turlar
        </button>
        <button className="filter-button" onClick={() => goToPage(2)} disabled={currentPage === 2}>
          Fuarlar
        </button>
      </div>

      {/* Conditional Rendering Based on Current Page with Transitions */}
      <CSSTransition
        in={currentPage === 1}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          {<ManagerTourSchedule />}
        </div>
      </CSSTransition>

      <CSSTransition
        in={currentPage === 2}
        timeout={500}
        classNames="page-content"
        unmountOnExit
      >
        <div className="page-content">
          {<Fuarlarim />}
        </div>
      </CSSTransition>
    </div>
  );
};

// Default Props
YaklasanEtkinlikler.defaultProps = {
  data: [],
  itemsPerPage: 5,
};

export default YaklasanEtkinlikler;
