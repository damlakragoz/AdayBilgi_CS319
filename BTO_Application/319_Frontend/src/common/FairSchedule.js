import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../tourguidepages/TourSchedule.css"; // Reuse the same CSS file

const FairSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fairs, setFairs] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Fetch fairs when the selected date changes
    useEffect(() => {
      const fetchFairs = async () => {
        try {
          const token = localStorage.getItem("userToken"); // Retrieve the auth token
          if (!token) {
            alert("Authorization token missing. Please log in.");
            return;
          }
          console.log("Retrieved Token:", token);

          // WE CURRENTLY DO NOT HAVE THIS ENDPOINT
          const response = await axios.get(
            "http://localhost:8081/api/fair/getAll",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the authorization token
              },
              withCredentials: true, // Include credentials if required by the API
            }
          );
          console.log(response);

          if (response.status === 200) {
            const allFairs = response.data;

            // Format the selected date to match the fair date format
            const formattedSelectedDate = formatDate(selectedDate);

            // Filter fairs based on the selected date
            const filteredFairs = allFairs.filter((fair) => {
              const fairDate = formatDate(new Date(fair.date));
              return fairDate === formattedSelectedDate;
            });

            // Update state with the filtered fairs
            setFairs(filteredFairs);

            console.log("Filtered Fairs:", filteredFairs);
          } else {
            alert("Belirtilen tarihte gerçekleşen fuar bulunamadı.");
          }
        } catch (error) {
          if (error.response) {
            console.error("Response Error:", error.response);
            alert(`Server Error: ${error.response.status} - ${error.response.data}`);
          } else if (error.request) {
            console.error("Request Error:", error.request);
            alert("Bağlantınızı kontrol ediniz");
          } else {
            console.error("Unexpected Error:", error.message);
            alert("Beklenmeyen bir hata oluştu: " + error.message);
          }
        }
      };

      fetchFairs();
    }, [selectedDate]); // Dependency array ensures it runs when the date changes


  return (
    <div className="tour-schedule-container"> {/* Reuse this class */}
      {/* Calendar Section */}
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="tr-TR"
        />
      </div>

      {/* Fair List Section */}
      <div className="tour-list-container"> {/* Reuse this class */}
        <h4 className="tour-list-header"> {/* Reuse this class */}
          {formatDate(selectedDate)} TARİHİNDEKİ FUARLAR
        </h4>
        {fairs.length > 0 ? (
          <ul>
            {fairs.map((fair) => (
              <li key={fair.id}>{fair.name}</li>
            ))}
          </ul>
        ) : (
          <p className="tour-list-placeholder"> {/* Reuse this class */}
            Bu tarihte fuar bulunmamaktadır.
          </p>
        )}
      </div>
    </div>
  );
};

export default FairSchedule;
