import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TourSchedule.css";

const TourSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

    // Fetch tours when the selected date changes
      useEffect(() => {
          try {
                const token = localStorage.getItem("userToken"); // Retrieve the auth token
                if (!token) {
                  alert("Authorization token missing. Please log in.");
                  // Redirect to login page, e.g., window.location.href = '/login';
                  return;
                }
                console.log("Retrieved Token:", token);
                    {
                      headers: {
                        Authorization: `Bearer ${token}`, // Include the authorization token
                      },
                      withCredentials: true, // Include credentials if required by the API
                    }
                );
                console.log(response);
              // Update state with the filtered tours

          } catch (error) {
                if (error.response) {
                    console.error("Response Error:", error.response);
                    alert(Server Error: ${error.response.status} - ${error.response.data});
                } else if (error.request) {
                    console.error("Request Error:", error.request);
                    alert("No response from the server. Check your network or backend.");
                } else {
                    console.error("Unexpected Error:", error.message);
                    alert("An unexpected error occurred: " + error.message);
                }
            }
        };
      }, [selectedDate]); // Dependency array ensures it runs when the date changes*/

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="tour-schedule-container">
      {/* Calendar Section */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="tr-TR"
          showNeighboringMonth={false}
        />
      </div>

      {/* Tour List Section */}
      <div className="tour-list-container">
        <h4 className="tour-list-header">
          {formatDate(selectedDate)} TARİHİNDEKİ ONAYLANMIŞ TURLAR
        </h4>
        <p className="tour-list-placeholder">
          Bu tarihte onaylanmış tur bulunmamaktadır.
        </p>
      </div>
    </div>
  );
};

export default TourSchedule;
