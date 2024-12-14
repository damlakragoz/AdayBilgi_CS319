import React, { useState } from "react";
import CoordinatorNavbar from './CoordinatorNavbar';
import CounselorList from '../common/CounselorList';
import TourGuideList from '../common/TourGuideList';
import "./BTOKoordinasyonu.css";

const BtoKoordinasyonu = ({ data = [], totalPages = 1 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleApprove = (id) => alert(`Approved ID: ${id}`);
  const handleReject = (id) => alert(`Rejected ID: ${id}`);
  const handleViewDetails = (id) => alert(`Viewing details for ID: ${id}`);

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="bto-container">
      <h1>BTO Koordinasyonu</h1>
      <h2>Tur Rehberleri</h2>
      <CoordinatorNavbar />
      <TourGuideList/>

      <h2>Rehber Öğretmenler</h2>
      <CounselorList/>
      <h2>Yeni Açılan Koordinatör Hesapları</h2>
      <table className="bto-table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Ad Soyad</th>
            <th>Bilkent ID</th>
            <th>Hareketler</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.id}</td>
              <td>
                <button
                  className="details-btn"
                  onClick={() => handleViewDetails(item.id)}
                >
                  Detayları Gör
                </button>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(item.id)}
                >
                  Onayla
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(item.id)}
                >
                  Reddet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={goToFirstPage}>&laquo; İlk</button>
        <button onClick={goToPreviousPage}>‹ Önceki</button>
        <span>
          Sayfa {currentPage} / {totalPages}
        </span>
        <button onClick={goToNextPage}>Sonraki ›</button>
        <button onClick={goToLastPage}>Son &raquo;</button>
      </div>
    </div>
  );
};

// Set default props
BtoKoordinasyonu.defaultProps = {
  data: [],       // Default to an empty array if no data is passed
  totalPages: 1,  // Default to 1 if no totalPages is passed
};

export default BtoKoordinasyonu;
