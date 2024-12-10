import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TourSchedule.css";

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
        <p className="tour-list-placeholder">
          Bu tarihte onaylanmış tur bulunmamaktadır.
        </p>
      </div>
    </div>
  );
};

export default TourSchedule;
