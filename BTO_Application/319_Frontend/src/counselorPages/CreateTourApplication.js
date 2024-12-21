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
        { id: "SLOT_9_10", displayName: "09:00-10:00" },
        { id: "SLOT_10_11", displayName: "10:00-11:00" },
        { id: "SLOT_11_12", displayName: "11:00-12:00" },
        { id: "SLOT_13_14", displayName: "13:00-14:00" },
        { id: "SLOT_14_15", displayName: "14:00-15:00" },
    ];

    const handleAddDateTime = () => {
        if (!selectedTimeSlot) {
            alert("Lütfen bir saat aralığı seçin!");
            return;
        }
        const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
        // Check if the date and timeSlot already exist in requestedDates
        const isDuplicate = requestedDates.some(
            (item) => item.date === formattedDate && item.timeSlot === selectedTimeSlot
        );

        if (isDuplicate) {
            alert("Bu tarih ve saat aralığı zaten seçildi!");
            return;
        }

        // Prevent the addition of more than 3 date options
        if (requestedDates.length < 3) {
            setRequestedDates((prev) => [
                ...prev,
                { date: formattedDate, timeSlot: selectedTimeSlot },
            ]);
        } else {
            alert("En fazla üç farklı tarih seçebilirsiniz.");
        }

        setSelectedTimeSlot(""); // Reset the time slot
    };


    const handleRemoveDateTime = (index) => {
        setRequestedDates((prev) => prev.filter((_, i) => i !== index));
    };

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

            const response = await axios.post(
                "http://localhost:8081/api/tour-applications/add/school-application",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in header
                    },
                    withCredentials: true,
                } // Ensures cookies and headers are included
            );

            if (response.status === 201) {
                alert("Başvurunuz başarıyla oluşturuldu!");
                setRequestedDates([]); // Clear the form
                setVisitorCount("");
            }

        } catch (error) {
            if(error.status === 409){
                alert("Başvurunuzda önceden yapmış olduğunuz aktif bir başvuruyla çakışan tarih var! ");
            }
            //console.error("Error submitting application:", error);
            //alert("Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false); // Reset loading spinner
        }
    };

    return (
        <div className="tour-application-container">
            <h2>Tur Başvurusu Yap</h2>
            <div className="tour-application-wrapper">
                <div className="tour-application-section">
                    <label>Tarih Seçiniz:</label>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        locale="tr-TR"
                        minDate={new Date()}
                        className="tour-application-calendar"
                    />
                </div>

                {/* New wrapper for right-aligned content */}
                <div className="tour-application-right-section">
                    <label>Saat Aralığı Seçiniz:</label>
                    <div className="tour-application-section">
                        <select
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="tour-application-dropdown">
                            <option value="">Saat Aralığı Seç</option>
                            {timeSlots.map((slot) => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.displayName}
                                </option>
                            ))}
                        </select>
                        <button className="tour-application-button" onClick={handleAddDateTime}>
                            Tarih ve Saat Ekle
                        </button>
                    </div>
                    <label>Seçilen Tarih ve Saatler:</label>
                    <div className="tour-application-selected-dates">
                        {requestedDates.length > 0 ? (
                            <ul>
                                {requestedDates.map((item, index) => {
                                    const timeSlotDisplayName = timeSlots.find(
                                        (slot) => slot.id === item.timeSlot
                                    )?.displayName;

                                    return (
                                        <li key={index}>
                                            <strong>Tarih:</strong> {item.date}, <strong>Saat:</strong> {timeSlotDisplayName || item.timeSlot}
                                            <button
                                                className="tour-application-remove-button"
                                                onClick={() => handleRemoveDateTime(index)}
                                            >
                                                Kaldır
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>Henüz tarih ve saat eklenmedi.</p>
                        )}
                    </div>

                    <label>Ziyaretçi Sayısını Giriniz:</label>
                    <div className="tour-application-section">

                        <input
                            type="number"
                            value={visitorCount}
                            onChange={(e) => setVisitorCount(e.target.value)}
                            placeholder="Ziyaretçi sayısı"
                            min="1"
                            className="tour-application-input"
                        />
                    </div>

                    <button className="tour-application-button" onClick={handleSubmit}>
                        Başvuruyu Onayla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTourApplication;
