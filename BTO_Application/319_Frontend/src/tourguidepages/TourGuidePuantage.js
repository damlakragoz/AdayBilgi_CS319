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
      const response = await axios.post(
        "http://localhost:8081/api/tour/submit-activity",
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

      if (response.status === 201) {
        alert("Activity duration submitted successfully!");

        // Update the local state: modify the submitted tour
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
      console.error("Error submitting activity:", error.message);
      alert("Failed to submit activity. Please try again.");
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
          Tours for {selectedDate.toLocaleDateString("tr-TR")}
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
                <strong>Tour ID:</strong> {tour.id} |{" "}
                <strong>Date:</strong>{" "}
                {formatISODate(new Date(tour.chosenDate))} |{" "}
                <strong>Status:</strong> {tour.tourStatus} |{" "}
                <strong>Duration:</strong>{" "}
                {tour.duration ? `${tour.duration} hours` : "Not submitted"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tours available for the selected date.</p>
        )}
      </div>

      {selectedTour && (
        <div className="activity-input-container">
          <h4>Submit Work Hours for Tour ID: {selectedTour.id}</h4>
          <label>
            Duration (in hours):
            <input
              type="number"
              value={activityDuration}
              onChange={(e) => setActivityDuration(e.target.value)}
              placeholder="Enter duration"
              min="0.5"
              step="0.5"
            />
          </label>
          <button onClick={handleSubmitDuration}>
            {selectedTour.tourStatus === "Finished"
              ? "Update Duration"
              : "Submit Duration"}
          </button>
        </div>
      )}

      {/* Button to navigate to Puantage Table */}
      <div className="puantage-table-button">
        <button
          onClick={() => navigate("/puantage-table")}
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
          View Puantage Table
        </button>
      </div>
    </div>
  );
};

export default TourGuidePuantage;
