import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TourGuidePuantage.css";

const TourGuidePuantage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [guideTours, setGuideTours] = useState([]); // Both GuideAssigned and Finished tours
  const [filteredTours, setFilteredTours] = useState([]); // Tours for the selected day
  const [selectedTour, setSelectedTour] = useState(null);
  const [activityDuration, setActivityDuration] = useState("");

  const guideEmail = localStorage.getItem("username");
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate(); // React Router navigation hook

  // Statüleri Türkçe'ye çevirmek için bir eşleme tablosu
  const statusTranslations = {
    GuideAssigned: "Rehber Atandı",
    Finished: "Tamamlandı",
    Approved: "Onaylandı",
    Withdrawn: "Çekildi",
    WithdrawRequested: "Çekilme Talep Edildi",
  };

  // Statüyü Türkçe'ye çeviren fonksiyon
  const translateStatusToTurkish = (status) => {
    return statusTranslations[status] || status; // Eğer çeviri yoksa orijinal değeri döndür
  };

  const formatISODate = (date) => date.toLocaleDateString("en-CA");

  // Fetch GuideAssigned and Finished tours for the logged-in guide
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(
            "http://localhost:8081/api/tour/getAll",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.status === 200) {
          const tours = response.data.filter(
              (tour) =>
                  (tour.tourStatus === "GuideAssigned" ||
                      tour.tourStatus === "Finished") &&
                  tour.assignedGuideEmail === guideEmail
          );
          setGuideTours(tours);
        }
      } catch (error) {
        console.error("Error fetching tours:", error.message);
      }
    };

    fetchTours();
  }, [guideEmail, token]);

  // Filter tours for the selected date
  useEffect(() => {
    const formattedSelectedDate = formatISODate(selectedDate);
    const toursForDay = guideTours.filter(
        (tour) => tour.chosenDate === formattedSelectedDate
    );
    setFilteredTours(toursForDay);
  }, [selectedDate, guideTours]);

  // Check tour statuses for the calendar
  const getTileClassName = ({ date, view }) => {
    if (view !== "month") return null;

    const dateStr = formatISODate(date);
    const toursForDay = guideTours.filter((tour) => tour.chosenDate === dateStr);

    if (toursForDay.length > 0) {
      const allFinished = toursForDay.every((tour) => tour.tourStatus === "Finished");
      const hasUnfinished = toursForDay.some((tour) => tour.tourStatus !== "Finished");

      if (allFinished) return "calendar-finished"; // Green background
      if (hasUnfinished) return "calendar-unfinished"; // Red background
    }

    return null; // Default background
  };

  // Submit or Update activity duration
  const handleSubmitDuration = async () => {
    if (!selectedTour || !activityDuration || activityDuration <= 0) {
      alert("Please select a tour and enter a valid duration.");
      return;
    }

    try {
      // Fetch all approved payments
      const approvedPaymentsResponse = await axios.get(
          "http://localhost:8081/api/payments/getAll", // Assuming this endpoint returns all payments
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const approvedPayments = approvedPaymentsResponse.data.filter(
          (payment) => payment.status === "APPROVED"
      );

      // Check if the selected tour's ID exists in the approved payments
      const isTourInApprovedPayments = approvedPayments.some(
          (payment) => payment.tourId === selectedTour.id
      );

      if (isTourInApprovedPayments) {
        alert(
            "Bu turun ödemesi onaylandı. Onaylanan turun ödemesi değiştirilemez!"
        );
        return;
      }

      // Determine the endpoint based on the tour status
      const endpoint =
          selectedTour.tourStatus === "Finished"
              ? "http://localhost:8081/api/tour/edit-activity"
              : "http://localhost:8081/api/tour/submit-activity";

      // Call the appropriate endpoint
      const response = await axios.post(
          endpoint,
          null,
          {
            params: {
              tourId: selectedTour.id,
              tourGuideEmail: guideEmail,
              duration: activityDuration,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (response.status === 201 || response.status === 200) {
        alert(
            selectedTour.tourStatus === "Finished"
                ? "Activity duration updated successfully!"
                : "Activity duration submitted successfully!"
        );

        // Update the local state
        setGuideTours((prev) =>
            prev.map((tour) =>
                tour.id === selectedTour.id
                    ? { ...tour, duration: activityDuration, tourStatus: "Finished" }
                    : tour
            )
        );

        setSelectedTour(null);
        setActivityDuration("");
      }
    } catch (error) {
      console.error("Error submitting or updating activity:", error.message);
      alert("Failed to submit or update activity. Please try again.");
    }
  };

  return (
      <div className="puantage-container">
        <div className="calendar-container">
          <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              locale="tr-TR"
              tileClassName={getTileClassName} // Apply custom classes
          />
        </div>

        <div className="tour-list-container">
          <h3>
            {selectedDate.toLocaleDateString("tr-TR")} Tarihindeki Turlar:
          </h3>
          {filteredTours.length > 0 ? (
              <ul>
                {filteredTours.map((tour) => (
                    <li
                        key={tour.id}
                        onClick={() => {
                          setSelectedTour(tour);
                          setActivityDuration(tour.duration || ""); // Prepopulate duration if already set
                        }}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                              selectedTour?.id === tour.id ? "#c3e6cb" : "#f8f9fa",
                          padding: "10px",
                          border: "1px solid #ddd",
                          margin: "5px 0",
                          borderRadius: "5px",
                        }}
                    >
                      <strong>Tur ID:</strong> {tour.id} |{" "}
                      <strong>Tarih:</strong>{" "}
                      {formatISODate(new Date(tour.chosenDate))} |{" "}
                      <strong>Durum:</strong> {translateStatusToTurkish(tour.tourStatus)} |{" "}
                      <strong>Süre:</strong>{" "}
                      {tour.duration ? `${tour.duration} saat` : "Gönderilmedi"}
                    </li>
                ))}
              </ul>
          ) : (
              <p>Seçilen tarihe ait tur bulunamamıştır.</p>
          )}
        </div>

        {selectedTour && (
            <div className="activity-input-container">
              <h4>{selectedTour.id} Numaralı Tur İçin Çalışma Saatinizi Giriniz: </h4>
              <label>
                Süre (saat):
                <input
                    type="number"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    placeholder="Süre giriniz"
                    min="0.5"
                    step="0.5"
                />
              </label>
              <button
                  onClick={handleSubmitDuration}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
              >
                {selectedTour.tourStatus === "Finished" ? "Aktiviteyi Düzenle" : "Aktiviteyi Tamamla"}
              </button>
            </div>
        )}

        {/* Button to navigate to Puantage Table */}
        <div className="puantage-table-button">
          <button
              onClick={() => navigate("/tourguide-puantage-table")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
          >
            Puantaj Tablosunu Gör
          </button>
        </div>
      </div>
  );
};
export default TourGuidePuantage;
