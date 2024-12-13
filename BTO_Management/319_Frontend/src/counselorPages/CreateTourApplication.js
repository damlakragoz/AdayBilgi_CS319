import React, { useState } from "react";
import "./CreateTourApplication.css";

const CreateTourApplication = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeRange, setSelectedTimeRange] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setConfirmed(false);
    };

    const handleTimeChange = (e) => {
        setSelectedTimeRange(e.target.value);
        setConfirmed(false);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTimeRange) {
            setConfirmed(true);
        } else {
            alert("Lütfen bir tarih ve saat aralığı seçin!");
        }
    };

    return (
        <div className="tour-application-container">
            <h2>Tur Başvurusu Yap</h2>
            <div className="tour-application-wrapper">
                <div className="calendar-section">
                    <label htmlFor="date-picker">Bir Tarih Seçiniz:</label>
                    <input
                        id="date-picker"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="date-picker"
                    />
                </div>

                <div className="time-selection-section">
                    <label htmlFor="time-range">Tur İçin Saat Aralığı Seçiniz:</label>
                    <select
                        id="time-range"
                        value={selectedTimeRange}
                        onChange={handleTimeChange}
                        className="time-dropdown"
                    >
                        <option value="">Saat Aralığı Seç</option>
                        <option value="09:00-11:00">09:00-11:00</option>
                        <option value="11:30-13:30">11:30-13:30</option>
                        <option value="14:00-16:00">14:00-16:00</option>
                        <option value="16:30-18:30">16:30-18:30</option>
                    </select>
                    <button className="select-button" onClick={handleConfirm}>
                        Seç
                    </button>
                </div>
            </div>

            <div className="summary-section">
                <h3>Zaman Tercihiniz:</h3>
                {confirmed && selectedDate && selectedTimeRange ? (
                    <div className="confirmation-box">
                        <p>Tarih: {new Date(selectedDate).toLocaleDateString("tr-TR")}</p>
                        <p>Saat: {selectedTimeRange}</p>
                        <button className="confirm-button">Tercihleri Onayla</button>
                    </div>
                ) : (
                    <p className="no-selection">Henüz bir tercih yapılmadı.</p>
                )}
            </div>
        </div>
    );
};

export default CreateTourApplication;
