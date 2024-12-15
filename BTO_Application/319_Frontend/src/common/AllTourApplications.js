import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FairInvitations.css'; // Import the updated CSS file

const timeSlots = [
  { id: "SLOT_9_10", displayName: "09:00-10:00" },
  { id: "SLOT_10_11", displayName: "10:00-11:00" },
  { id: "SLOT_11_12", displayName: "11:00-12:00" },
  { id: "SLOT_13_14", displayName: "13:00-14:00" },
  { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

// Mapping of application status in English to Turkish
const statusMap = {
  "pending": "Onay bekliyor",
  "approved": "Onaylandı",
  "rejected": "Reddedildi",
  "in_progress": "İşleniyor",
  "completed": "Tamamlandı",
  "not_specified": "-",
};

const AllTourApplications = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/tour-applications/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert("Failed to fetch tour applications. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    console.log("Date"+date);
    console.log("ParsedDate: " +parsedDate.toLocaleString);
    return isNaN(parsedDate) ? "Geçersiz Tarih" : parsedDate.toLocaleString();
  };

  const getTimeSlotDisplayName = (slotId) => {
    const slot = timeSlots.find((slot) => slot.id === slotId);
    return slot ? slot.displayName : "Belirtilmedi"; // Fallback if no match
  };

  const mapStatusToTurkish = (status) => {
    const normalizedStatus = status ? status.trim().toLowerCase() : "not_specified";
    return statusMap[normalizedStatus] || statusMap["not_specified"]; // Default to "Belirtilmedi" if not found
  };

  return (
    <div className="fair-tour-lists-outer-container">
      <h1 className="fair-tour-lists-title">Tur Başvuruları</h1>
      <div className="fair-tour-lists-table-container">
        <table className="fair-tour-lists-table">
          <thead>
            <tr>
              <th>Başvuru Durumu</th>
              <th>Lise Adı</th>
              <th>Başvuran Rehber Öğretmen</th>
              <th>Atanan Tur Tarihi</th>
              <th>Seçilen Zaman Dilimi</th>
              <th>İşlenme Zamanı</th>
              <th>Talep Edilen Tarihler</th>
              <th>Katılımcı Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((tourApplication, index) => (
              <tr key={index}>
                <td>{mapStatusToTurkish(tourApplication.applicationStatus) || "Belirtilmedi"}</td>
                <td>{tourApplication.applyingCounselor.schoolName ? tourApplication.applyingCounselor.schoolName : "Bilinmiyor"}</td>
                <td>{tourApplication.applyingCounselor ? tourApplication.applyingCounselor.firstName : "Bilinmiyor"}</td>
                <td>{tourApplication.selectedDate ? formatDate(tourApplication.selectedDate) : "Seçilmedi"}</td>
                <td>{getTimeSlotDisplayName(tourApplication.selectedTimeSlot)}</td>
                <td>{tourApplication.transitionTime ? formatDate(tourApplication.transitionTime) : "Yok"}</td>
                <td>
                  {tourApplication.requestedDates?.length
                    ? tourApplication.requestedDates.map((date, idx) => (
                        <div key={idx}>{formatDate(date)}</div>
                      ))
                    : "Talep Yok"}
                </td>
                <td>{tourApplication.visitorCount ? tourApplication.visitorCount : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fair-tour-lists-footer">
        <div className="fair-tour-lists-pagination-info">
          {`Page ${currentPage} of ${totalPages}`}
        </div>
        <div className="fair-tour-lists-arrow-navigation">
          <span
            className={`fair-tour-lists-arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePreviousPage}
          >
            {'<'}
          </span>
          <span
            className={`fair-tour-lists-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
          >
            {'>'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllTourApplications;
