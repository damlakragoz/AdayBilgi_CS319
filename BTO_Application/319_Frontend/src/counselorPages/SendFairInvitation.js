import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SendFairInvitation.css";

const SendFairInvitation = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const timeSlots = [
        "15:30-17:30",
        "10:00-12:00",
        "13:00-15:00",
        "18:00-20:00",
    ];

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            setIsModalOpen(true); // Open the modal for confirmation
        } else {
            alert("Lütfen bir tarih ve saat seçiniz.");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleFinalApproval = () => {
        alert(`Davetiyeniz gönderildi!\nTarih: ${selectedDate.toLocaleDateString("tr-TR")}\nSaat: ${selectedTime}`);
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="send-fair-invitation-container">
            <h2 className="send-fair-invitation-header">Fuar Davetiyesi Gönder</h2>
            <div className="invitation-content">
                {/* Calendar Section */}
                <div className="calendar-section">
                    <label className="section-label">Tarih Seçiniz:</label>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        locale="tr-TR"
                    />
                </div>

                {/* Time Selection Section */}
                <div className="time-selection-section">
                    <label className="section-label">Fuar İçin Saat Aralığı Seçiniz:</label>
                    <select
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="time-selection-dropdown"
                    >
                        <option value="">Saat Aralığı Seç</option>
                        {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                    <button className="select-button" onClick={handleConfirm}>
                        Seç
                    </button>
                </div>
            </div>

            {/* Modal Section */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Tercihlerinizi Onaylayın</h3>
                        <p>
                            <strong>Tarih:</strong> {selectedDate ? selectedDate.toLocaleDateString("tr-TR") : "Seçilmedi"}
                        </p>
                        <p>
                            <strong>Saat:</strong> {selectedTime || "Seçilmedi"}
                        </p>
                        <div className="modal-actions">
                            <button className="modal-confirm-button" onClick={handleFinalApproval}>
                                Onayla
                            </button>
                            <button className="modal-cancel-button" onClick={handleModalClose}>
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendFairInvitation;
