import React, { useState } from "react";
import "./SendFairInvitation.css";

const SendFairInvitation = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("15:30-17:30");

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            alert(`Davetiyeniz gönderildi! Tarih: ${selectedDate}, Saat: ${selectedTime}`);
        } else {
            alert("Lütfen tarih ve saat seçiniz.");
        }
    };

    return (
        <div className="send-fair-invitation-container">
            <h2 className="send-fair-invitation-header">Fuar Davetiyesi Gönder</h2>
            <div className="invitation-content">
                <div className="calendar-section">
                    <label htmlFor="date-picker" className="section-label">
                        Tarih Seçiniz:
                    </label>
                    <input
                        type="date"
                        id="date-picker"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="date-picker"
                    />
                </div>
                <div className="time-selection-section">
                    <label className="section-label">Fuar İçin Saat Aralığı Seçiniz:</label>
                    <select
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="time-selection-dropdown"
                    >
                        <option value="15:30-17:30">15:30-17:30</option>
                        <option value="10:00-12:00">10:00-12:00</option>
                        <option value="13:00-15:00">13:00-15:00</option>
                    </select>
                    <button className="select-button">Seç</button>
                </div>
                <div className="time-confirm-section">
                    <h3>Zaman Tercihiniz:</h3>
                    <p>
                        Tarih: {selectedDate || "Henüz bir tarih seçilmedi"} <br />
                        Saat: {selectedTime}
                    </p>
                    <button className="confirm-button" onClick={handleConfirm}>
                        Tercihleri Onayla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendFairInvitation;
