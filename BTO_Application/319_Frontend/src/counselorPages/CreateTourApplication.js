import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CreateTourApplication.css";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTourApplication = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [visitorCount, setVisitorCount] = useState("");
    const [requestedDates, setRequestedDates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            toast.error("Lütfen bir saat aralığı seçin!");
            return;
        }
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        const isDuplicate = requestedDates.some(
            (item) => item.date === formattedDate && item.timeSlot === selectedTimeSlot
        );

        if (isDuplicate) {
            toast.error("Bu tarih ve saat aralığı zaten seçildi!");
            return;
        }

        if (requestedDates.length < 3) {
            setRequestedDates((prev) => [
                ...prev,
                { date: formattedDate, timeSlot: selectedTimeSlot },
            ]);
        } else {
            toast.error("En fazla üç farklı tarih seçebilirsiniz.");
        }

        setSelectedTimeSlot("");
    };

    const handleRemoveDateTime = (index) => {
        setRequestedDates((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (requestedDates.length === 0) {
            toast.error("Lütfen en az bir tarih ve saat aralığı seçin!");
            return;
        }
        if (!visitorCount) {
            toast.error("Lütfen ziyaretçi sayısını girin!");
            return;
        }
        if (visitorCount > 60) {
            toast.error("Tur gerekleri sebebiyle ziyaretçi sayısı 60'tan fazla olamaz.");
            return;
        }

        const payload = {
            tourApplication: {
                requestedDates,
                visitorCount: parseInt(visitorCount, 10),
            },
            counselorUsername: email,
        };

        try {
            setIsSubmitting(true);
            const response = await axios.post(
                "http://localhost:8081/api/tour-applications/add/school-application",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                toast.info("Başvurunuz başarıyla oluşturuldu!");
                setRequestedDates([]);
                setVisitorCount("");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error(
                    "Başvurunuz lisenize ait aktif bir başvuruyla çakışıyor! Bu başvuru size ait değilse okulunzdaki diğer rehber öğretmenlerine danışınız. Lütfen farklı bir tarih seçiniz.",
                    {
                        position: "top-center",
                        style: { width: "600px" },
                        autoClose: false,
                        closeOnClick: false,
                        draggable: false,
                        onOpen: () => {}

                    });
            } else {
                toast.error("Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tour-application-container">
            <h2>Tur Başvurusu Yap</h2>
            <div className="tour-application-wrapper">
                <div className="tour-application-left-container">
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
                </div>
                <div className="tour-application-right-container">
                    <label>Saat Aralığı Seçiniz:</label>
                    <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="tour-application-dropdown"
                    >
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
                    <label>Seçilen Tarih ve Saatler:</label>
                    <ul className="tour-application-selected-dates">
                        {requestedDates.length > 0 ? (
                            requestedDates.map((item, index) => {
                                const timeSlotDisplayName = timeSlots.find(
                                    (slot) => slot.id === item.timeSlot
                                )?.displayName;
                                return (
                                    <li key={index}>
                                        <strong>Tarih:</strong> {item.date} <strong>Saat:</strong>{" "}
                                        {timeSlotDisplayName || item.timeSlot}
                                        <button
                                            className="tour-application-remove-button"
                                            onClick={() => handleRemoveDateTime(index)}
                                        >
                                            Kaldır
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <p>Henüz tarih ve saat eklenmedi.</p>
                        )}
                    </ul>
                    <label>Ziyaretçi Sayısını Giriniz:</label>
                    <input
                        type="number"
                        value={visitorCount}
                        onChange={(e) => setVisitorCount(e.target.value)}
                        placeholder="Ziyaretçi sayısı"
                        min="1"
                        className="tour-application-input"
                    />
                </div>
            </div>
            <div className="submit-button-container">
                <button
                    className="tour-application-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Onayla"}
                </button>
            </div>
        </div>
    );


};

export default CreateTourApplication;
