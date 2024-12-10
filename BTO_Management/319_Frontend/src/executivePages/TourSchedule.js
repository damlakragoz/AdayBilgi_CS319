import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TourSchedule.css";
import "../App.css";

const TourSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  return (
    <div className="tourschedule-container">
      {/* Calendar Section */}
      <div className="tourschedule-calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="tr-TR"
        />
      </div>

      {/* Tour List Section */}
      <div className="tourschedule-tour-list-container">
        <h4 className="tourschedule-tour-list-header">
          {formatDate(selectedDate)} Tarihindeki Onaylanmış Turlar
        </h4>
        <p className="tourschedule-tour-list-placeholder">
          Bu tarihte onaylanmış tur bulunmamaktadır.
        </p>
      </div>
    </div>
  );
};

export default TourSchedule;
