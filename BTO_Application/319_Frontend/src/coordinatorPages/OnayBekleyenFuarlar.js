import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnayBekleyen.css';

const OnayBekleyenFuarlar = () => {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleState, setToggleState] = useState(false); // State to trigger rerender

  const statusMap = {
    created: "Oluşturuldu",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    cancelled: "İptal Edildi",
    finished: "Tamamlandı",
    not_specified: "-",
  };

  const fetchFairs = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authorization token missing. Please log in.');
        return;
      }

      const response = await axios.get("http://localhost:8081/api/fair-invitations/getAll", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(response.data)
      const createdFairs = response.data.filter((fairInv) => fairInv.fairInvitationStatus == 'Created');
      console.log(createdFairs)
      setFairs(createdFairs);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error fetching data');
      setFairs([]);
    } finally {
      setLoading(false);
    }
  };

  //

      // Function to handle fair approval
      const handleApprove = async (fairInvId) => {
          try {
              const token = localStorage.getItem("userToken");
              if (!token) {
                  alert("Authorization token missing. Please log in.");
                  return;
              }

              const btoManagerEmail = localStorage.getItem("username");
              const response = await axios.post(
                  "http://localhost:8081/api/fair-invitations/bto-manager/approve",
                  null,
                  {
                      params: {
                          btoManagerEmail: btoManagerEmail,
                          fairInvitationId: fairInvId,
                      },
                      headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                      },
                      withCredentials: true,
                  }
              );

              if (response.status === 200 || response.status === 201 || response.status === 202) {

                  setFairs((prevFairs) =>
                      prevFairs.map((fair) =>
                          fair.id === fairInvId ? { ...fair, fairInvitationStatus: "Created" } : fair
                      )
                  );
                  setToggleState((prev) => !prev); // Trigger rerender

                  alert("Fair invitation approved successfully!");
              } else {
                  console.log("Unexpected response status:"+ response.status);
                  alert("Failed to approve the fair. Please try again.");
              }
          } catch (error) {
              console.log("Error approving fair:", error.response ? error.response.data : error.message);
              alert("Failed to approve the fair. Please try again.");
          }
      };


      // Function to handle tour rejection
      const handleReject = async (fairInvId) => {
          try {
              const token = localStorage.getItem("userToken");
              if (!token) {
                  alert("Authorization token missing. Please log in.");
                  return;
              }

              const btoManagerEmail = localStorage.getItem("username");
              const response = await axios.post(
                  "http://localhost:8081/api/fair-invitations/bto-manager/reject",
                    null,
                    {
                        params: {
                            btoManagerEmail: btoManagerEmail,
                            fairInvitationId: fairInvId,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
              );

              if (response.status === 200 || response.status === 201 || response.status === 202) {

                  setFairs((prevFairs) =>
                        prevFairs.map((fair) =>
                            fair.id === fairInvId ? { ...fair, fairInvitationStatus: "Created" } : fair
                        )
                    );
                  setToggleState((prev) => !prev); // Trigger rerender

                  alert("Fair rejected successfully!");
              }
          } catch (error) {
              console.error("Error rejecting tour:", error.message);
              alert("Failed to reject the tour. Please try again.");
          }
      };

      // Fetch tours on component load and when toggleState changes
      useEffect(() => {
          fetchFairs();
      }, [toggleState]);

  const formatDate = (date) => {
    if (!date) return "Geçersiz Tarih";
    try {
      const [year, month, day] = date.split('-');
      const parsedDate = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsedDate);
    } catch {
      return "Geçersiz Tarih";
    }
  };

  const formatTime = (time) => {
    if (!time) return "Geçersiz Saat";
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return "Geçersiz Saat";
    }
  };

  const mapStatusToTurkish = (status) => {
    const normalizedStatus = status ? status.trim().toLowerCase() : "not_specified";
    return statusMap[normalizedStatus] || statusMap["not_specified"];
  };

  if (loading) return <div className="onay-bekleyen-container">Yükleniyor...</div>;
  if (error) return <div className="onay-bekleyen-container">{error}</div>;

  return (
    <div className="onay-bekleyen-container">
      <h1 className="onay-bekleyen-header">Onay Bekleyen Fuar Davetleri</h1>
      <table className="onay-bekleyen-activity-table">
        <thead>
          <tr>
            <th>Durum</th>
            <th>Okul Adı</th>
            <th>Fuar Tarihi</th>
            <th>Fuar Saatleri</th>
            <th>Tercihler</th>
          </tr>
        </thead>
        <tbody>
          {fairs.map((fair, index) => (
            <tr key={index}>
              <td>{mapStatusToTurkish(fair.fairInvitationStatus)}</td>
              <td>{fair.applyingCounselor?.schoolName || "Bilinmiyor"}</td>
              <td>
                {fair.fairStartDate !== fair.fairEndDate
                  ? `${formatDate(fair.fairStartDate)} - ${formatDate(fair.fairEndDate)}`
                  : formatDate(fair.fairStartDate)}
              </td>
              <td>
                {fair.fairStartTime && fair.fairEndTime
                  ? `${formatTime(fair.fairStartTime)} - ${formatTime(fair.fairEndTime)}`
                  : "Bilinmiyor"}
              </td>
              <td className="onay-bekleyen-buttons">
                <button className="onay-bekleyen-approve-btn"
                    onClick={() => handleApprove(fair.id)}>
                    Onayla
                </button>
                <button className="onay-bekleyen-reject-btn"
                    onClick={() => handleReject(fair.id)}>
                    Reddet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnayBekleyenFuarlar;
