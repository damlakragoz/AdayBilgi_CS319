import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify'; // Import the toast for error notifications
import "../common/FairInvitations.css"; // Reuse the same CSS file

const statusMap = {
  "pending": "Onay bekliyor",
  "created": "Oluşturuldu",
  "approved": "Onaylandı",
  "rejected": "Reddedildi",
  "cancelled": "İptal Edildi",
  "finished": "Tamamlandı",
  "not_specified": "-",
};

const FairSchedule = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    let shownError = false;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          toast.error("Authorization token missing. Lütfen giriş yapın.", { autoClose: 3000 });
          return;
        }

        const response = await axios.get("http://localhost:8081/api/fair/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(response.data);
      } catch (error) {
        if (!shownError) {
          console.error('Error fetching data:', error);
          toast.error("Fuar davetleri veri tabanından alınamadı. Lütfen daha sonra tekrar deneyin.", { autoClose: 3000 });
          shownError = true;
        }
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / rowsPerPage) === 0 ? 1 : Math.ceil(data.length / rowsPerPage);
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
    if (!date) return "Geçersiz Tarih";
    try {
      const [year, month, day] = date.split('-');
      const parsedDate = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(parsedDate);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Geçersiz Tarih";
    }
  };

  const mapStatusToTurkish = (status) => {
    const normalizedStatus = status ? status.trim().toLowerCase() : "not_specified";
    return statusMap[normalizedStatus] || statusMap["not_specified"];
  };

  const formatTime = (time) => {
    if (!time) return "Geçersiz Saat";
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Geçersiz Saat";
    }
  };

  return (
    <div className="fair-tour-lists-outer-container">
      <h1 className="fair-tour-lists-title">Fuar Takvimi</h1>
      <div className="fair-tour-lists-table-container">
        <table className="fair-tour-lists-table">
          <thead>
            <tr>
              <th>Davet Durumu</th>
              <th>Lise Adı</th>
              <th>Tarihler</th>
              <th>Saatler</th>
              <th>Rehber Öğretmen</th>
              <th>Rehber Öğretmen E-maili</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((fair, index) => (
              <tr key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                <td>{mapStatusToTurkish(fair.fairInvitationStatus) || "Belirtilmedi"}</td>
                <td>{fair.applyingCounselor || "Bilinmiyor"}</td>
                <td>{fair.fairStartDate !== fair.fairEndDate
                  ? `${formatDate(fair.fairStartDate)} - ${formatDate(fair.fairEndDate)}`
                  : `${formatDate(fair.fairStartDate)}`}</td>
                <td>
                  {fair.fairStartTime && fair.fairEndTime
                    ? `${formatTime(fair.fairStartTime)} - ${formatTime(fair.fairEndTime)}`
                    : "Bilinmiyor"}
                </td>
                <td>{fair.applyingCounselor ? `${fair.applyingCounselor.firstName} ${fair.applyingCounselor.lastName}` : "Bilinmiyor"}</td>
                <td>{fair.applyingCounselor ? fair.applyingCounselor.email : "Bilinmiyor"}</td>
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

export default FairSchedule;
