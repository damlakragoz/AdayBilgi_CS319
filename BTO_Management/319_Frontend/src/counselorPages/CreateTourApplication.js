import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CreateTourApplication.css";
import ReactDOM from "react-dom";
import axios from "axios";

const CreateTourApplication = () => {
    const [selectedDate, setSelectedDate] = useState(new Date()); // Currently selected date
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Currently selected time slot
    const [visitorCount, setVisitorCount] = useState(""); // Number of visitors
    const [requestedDates, setRequestedDates] = useState([]); // List of date-time combinations
    const [isModalOpen, setIsModalOpen] = useState(false); // Confirmation modal state
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

    const email = localStorage.getItem("username");
    const token = localStorage.getItem("userToken");

    const timeSlots = [
        "SLOT_9_10",
        "SLOT_10_11",
        "SLOT_11_12",
        "SLOT_13_14",
        "SLOT_14_15",
    ];

    // Add a selected date and time slot to the list
    const handleAddDateTime = () => {
        if (!selectedTimeSlot) {
            alert("Lütfen bir saat aralığı seçin!");
            return;
        }
        const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
        setRequestedDates((prev) => [
            ...prev,
            { date: formattedDate, timeSlot: selectedTimeSlot },
        ]);
        setSelectedTimeSlot(""); // Reset the time slot
    };

    // Remove a date-time combination from the list
    const handleRemoveDateTime = (index) => {
        setRequestedDates((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit the application
    const handleSubmit = async () => {
        if (requestedDates.length === 0) {
            alert("Lütfen en az bir tarih ve saat aralığı seçin!");
            return;
        }
        if (!visitorCount) {
            alert("Lütfen ziyaretçi sayısını girin!");
            return;
        }

        const payload = {
            tourApplication: {
                requestedDates, // The array of selected dates and time slots
                visitorCount: parseInt(visitorCount, 10), // Ensure visitor count is an integer
            },
            counselorUsername: email, // Replace with actual username
        };
        try {
            setIsSubmitting(true); // Show loading spinner

            console.log("before the request" + JSON.stringify(payload.tourApplication.requestedDates) + "  " + payload.counselorUsername)

            const response = await axios.post(
                "http://localhost:8081/api/tour-applications/add/school-application",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in header
                    },
                    withCredentials: true,
                }// Ensures cookies and headers are included
            );

            console.log("payload before the response" + payload);
            if (response.status === 201) {
                alert("Başvurunuz başarıyla oluşturuldu!");
                setRequestedDates([]); // Clear the form
                setVisitorCount("");
            }

        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false); // Reset loading spinner
        }
    };

    return (
        <div className="tour-application-container">
            <h2>Tur Başvurusu Yap</h2>
            <div className="tour-application-wrapper">
                {/* Calendar for selecting date */}
                <div className="calendar-section">
                    <label>Tarih Seçiniz:</label>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        locale="tr-TR"
                    />
                </div>

                {/* Time slot selection */}
                <div className="time-selection-section">
                    <label>Saat Aralığı Seçiniz:</label>
                    <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="time-dropdown"
                    >
                        <option value="">Saat Aralığı Seç</option>
                        {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                    <button className="add-button" onClick={handleAddDateTime}>
                        Tarih ve Saat Ekle
                    </button>
                </div>

                {/* Visitor count input */}
                <div className="visitor-count-section">
                    <label>Ziyaretçi Sayısını Giriniz:</label>
                    <input
                        type="number"
                        value={visitorCount}
                        onChange={(e) => setVisitorCount(e.target.value)}
                        placeholder="Ziyaretçi sayısı"
                        min="1"
                        className="visitor-count-input"
                    />
                </div>

                {/* List of selected date-time combinations */}
                <div className="selected-dates-section">
                    <h3>Seçilen Tarih ve Saatler:</h3>
                    {requestedDates.length > 0 ? (
                        <ul>
                            {requestedDates.map((item, index) => (
                                <li key={index}>
                                    <strong>Tarih:</strong> {item.date}, <strong>Saat:</strong>{" "}
                                    {item.timeSlot}
                                    <button
                                        className="remove-button"
                                        onClick={() => handleRemoveDateTime(index)}
                                    >
                                        Kaldır
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Henüz tarih ve saat eklenmedi.</p>
                    )}
                </div>

                {/* Submit button */}
                <button className="submit-button" onClick={handleSubmit}>
                    Başvuruyu Onayla
                </button>
            </div>

            {/* Confirmation modal */}
            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Başvurunuzu Onaylayın</h3>
                            <p><strong>Tarih ve Saatler:</strong></p>
                            <ul>
                                {requestedDates.map((item, index) => (
                                    <li key={index}>
                                        {item.date} - {item.timeSlot}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Ziyaretçi Sayısı:</strong> {visitorCount}</p>
                            <div className="modal-actions">
                                <button
                                    className="modal-confirm-button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Gönderiliyor..." : "Onayla"}
                                </button>
                                <button
                                    className="modal-cancel-button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                >
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
