import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CreateTourApplication.css";
import ReactDOM from "react-dom";

const CreateTourApplication = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const timeSlots = [
        "09:00-11:00",
        "11:00-13:00",
        "14:00-16:00",
        "16:30-18:30",
    ];

    const handleTimeChange = (e) => {
        setSelectedTimeRange(e.target.value);
    };

    const handleConfirm = () => {
        if (selectedTimeRange) {
            setIsModalOpen(true); // Open the modal when preferences are set
        } else {
            alert("Lütfen bir saat aralığı seçin!");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleFinalApproval = () => {
        // Logic to handle approval, such as sending data to an API
        alert("Tur tercihleri başarıyla onaylandı!");
        setIsModalOpen(false); // Close the modal after confirmation
    };

    return (
        <div className="tour-application-container">
            <h2>Tur Başvurusu Yap</h2>
            <div className="tour-application-wrapper">
                <div className="calendar-section">
                    <label>Bir Tarih Seçiniz:</label>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        locale="tr-TR"
                    />
                </div>
                <div className="time-selection-section">
                    <label>Tur İçin Saat Aralığı Seçiniz:</label>
                    <select
                        value={selectedTimeRange}
                        onChange={handleTimeChange}
                        className="time-dropdown"
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

            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Tercihlerinizi Onaylayın</h3>
                            <p><strong>Tarih:</strong> {selectedDate.toLocaleDateString("tr-TR")}</p>
                            <p><strong>Saat:</strong> {selectedTimeRange}</p>
                            <div className="modal-actions">
                                <button className="modal-confirm-button" onClick={handleFinalApproval}>
                                    Onayla
                                </button>
                                <button className="modal-cancel-button" onClick={handleModalClose}>
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("modal-root")
                )}
        </div>
    );
};

export default CreateTourApplication;
