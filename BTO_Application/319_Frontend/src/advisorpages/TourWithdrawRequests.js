import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TourWithdrawRequests.css";

// Haftanın günlerini Türkçe'ye çevirmek için bir eşleme tablosu
const dayTranslations = {
  Monday: "Pazartesi",
  Tuesday: "Salı",
  Wednesday: "Çarşamba",
  Thursday: "Perşembe",
  Friday: "Cuma",
  Saturday: "Cumartesi",
  Sunday: "Pazar",
};

// Haftanın gününü Türkçe'ye çeviren fonksiyon
const translateDayToTurkish = (day) => {
  return dayTranslations[day] || day; // Eğer gün bulunamazsa orijinal değeri döndür
};

const TourWithdrawRequests = () => {
  const [withdrawnTours, setWithdrawnTours] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");
  const advisorEmail = localStorage.getItem("username");
  const [advisorAssignedDay, setAdvisorAssignedDay] = useState("");

  useEffect(() => {
    const fetchWithdrawnTours = async () => {
      try {
        const response = await axios.get(
            "http://localhost:8081/api/advisor/get/all-assigned-day-tours",
            {
              params: { advisorEmail: advisorEmail },
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.status === 200) {
          const filteredTours = await Promise.all(
              response.data
                  .filter((tour) => tour.tourStatus === "WithdrawRequested")
                  .map(async (tour) => {
                    try {
                      const guideResponse = await axios.get(
                          "http://localhost:8081/api/tour/get/assignedGuide",
                          {
                            params: { tourId: tour.id },
                            headers: { Authorization: `Bearer ${token}` },
                          }
                      );

                      const assignedGuideEmail = guideResponse.data?.email;
                      return { ...tour, guideEmail: assignedGuideEmail || "No Guide Assigned" };
                    } catch (error) {
                      console.error(
                          `Error fetching guide for tour ID ${tour.id}:`,
                          error
                      );
                      return { ...tour, guideEmail: "Error Fetching Guide" };
                    }
                  })
          );

          setWithdrawnTours(filteredTours.filter((tour) => tour !== null));
        }
      } catch (err) {
        setError("Failed to load withdraw requests.");
        console.error(err);
      }
    };

    fetchWithdrawnTours();
  }, [token, advisorEmail]);

  useEffect(() => {
    const fetchAdvisorAssignedDay = async () => {
      try {
        if (!token || !advisorEmail) {
          alert("Authorization or email missing. Please log in.");
          return;
        }

        const response = await axios.get(
            "http://localhost:8081/api/users/getByEmail",
            {
              params: { email: advisorEmail },
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
        );

        if (response.status === 200 && response.data) {
          const assignedDay = translateDayToTurkish(response.data.assignedDay || "No Day Assigned");
          setAdvisorAssignedDay(assignedDay);
        }
      } catch (error) {
        console.error(
            "Danışmanı getirirken bir hata ile karşılaşıldı!",
            error.message
        );
        setAdvisorAssignedDay("Error fetching data");
      }
    };

    fetchAdvisorAssignedDay();
  }, []);

  const handleAccept = async (tourId) => {
    try {
      const response = await axios.put(
          "http://localhost:8081/api/tour/accept-withdraw-request",
          { tourId, advisorEmail },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 || response.status === 201) {
        alert("Tur geri çekilme isteği başarıyla kabul edildi!");
      }
      setWithdrawnTours((prev) => prev.filter((tour) => tour.id !== tourId));
    } catch (err) {
      console.error(err);
      alert("Geri çekilme isteği kabul edilemedi!");
    }
  };

  const handleReject = async (tourId) => {
    try {
      const response = await axios.put(
          "http://localhost:8081/api/tour/reject-withdraw-request",
          { tourId, advisorEmail },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 || response.status === 201) {
        alert("Tur geri çekilme isteği başarıyla reddedildi!");
      }
      setWithdrawnTours((prev) => prev.filter((tour) => tour.id !== tourId));
    } catch (err) {
      console.error(err);
      alert("Turdan çekilme isteği yapılırken bir hata oluştu!");
    }
  };

  return (
      <div className="withdraw-container">
        <h1 className="main-title">TURDAN ÇEKİLME İSTEKLERİ</h1>

        {advisorAssignedDay && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
                Sorumlu Olduğunuz Gün
              </p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--orange)" }}>
                {advisorAssignedDay}
              </p>
            </div>
        )}

        {error && <p className="error">{error}</p>}

        <div className="withdraw-list">
          {withdrawnTours.length > 0 ? (
              withdrawnTours.map((tour) => (
                  <div key={tour.id} className="withdraw-card">
                    <div className="tour-details">
                      <div>
                        <strong>Tour ID:</strong> {tour.id}
                      </div>
                      <div>
                        <strong>Date:</strong> {tour.chosenDate}
                      </div>
                      <div>
                        <strong>Time Slot:</strong> {tour.chosenTimeSlot}
                      </div>
                      <div>
                        <strong>Guide Email:</strong> {tour.guideEmail || "Loading..."}
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button
                          className="accept-btn"
                          onClick={() => handleAccept(tour.id)}
                      >
                        Onayla
                      </button>
                      <button
                          className="reject-btn"
                          onClick={() => handleReject(tour.id)}
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
              ))
          ) : (
              <p>Herhangi bir geri çekilme isteği bulunmuyor.</p>
          )}
        </div>
      </div>
  );
};

export default TourWithdrawRequests;
