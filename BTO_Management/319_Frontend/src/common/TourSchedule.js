import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./TourSchedule.css";

const TourSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tours, setTours] = useState([]); // State to hold the tours for the selected date

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Format the date to "DD MMMM YYYY" format
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Fetch tours when the selected date changes
  useEffect(() => {
    const fetchTours = async () => {
      try {
            const token = localStorage.getItem("userToken"); // Retrieve the auth token
            if (!token) {
              alert("Authorization token missing. Please log in.");
              // Redirect to login page, e.g., window.location.href = '/login';
              return;
            }
            console.log("Retrieved Token:", token);

            // Call the /getAll endpoint
            const response = await axios.get(
                "http://localhost:8081/api/tour/getAll",
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Include the authorization token
                  },
                  withCredentials: true, // Include credentials if required by the API
                }
            );
            console.log(response);

        if (response.status === 200) {
          // Assuming response.data contains all tours
          const allTours = response.data;

          // Format the selected date to match the tour date format
          const formattedSelectedDate = formatDate(selectedDate); // e.g., "DD MMMM YYYY"

          // Filter tours based on the selected date
          const filteredTours = allTours.filter((tour) => {
            const tourDate = formatDate(new Date(tour.date)); // Ensure correct format
            return tourDate === formattedSelectedDate;
          });

          // Update state with the filtered tours
          setTours(filteredTours);

          console.log("Filtered Tours:", filteredTours);
          alert(
            `Tours for the chosen date:\n${JSON.stringify(filteredTours, null, 2)}`
          );
        } else {
          alert("No tours found for the specified date.");
        }
      } catch (error) {
            if (error.response) {
                console.error("Response Error:", error.response);
                alert(`Server Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                console.error("Request Error:", error.request);
                alert("No response from the server. Check your network or backend.");
            } else {
                console.error("Unexpected Error:", error.message);
                alert("An unexpected error occurred: " + error.message);
            }
        }
    };

    fetchTours();
  }, [selectedDate]); // Dependency array ensures it runs when the date changes

  return (
    <div className="tour-schedule-container">
      {/* Calendar Section */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="tr-TR"
        />
      </div>

      {/* Tour List Section */}
      <div className="tour-list-container">
        <h4 className="tour-list-header">
          {formatDate(selectedDate)} TARİHİNDEKİ ONAYLANMIŞ TURLAR
        </h4>
        {/* Render tours or a placeholder */}
        {tours.length > 0 ? (
          <ul>
            {tours.map((tour) => (
              <li key={tour.id}>{tour.name}</li>
            ))}
          </ul>
        ) : (
          <p className="tour-list-placeholder">
            Bu tarihte onaylanmış tur bulunmamaktadır.
          </p>
        )}
      </div>
    </div>
  );
};

export default TourSchedule;
