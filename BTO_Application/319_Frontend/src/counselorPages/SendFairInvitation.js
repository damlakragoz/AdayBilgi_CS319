import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SendFairInvitation.css";
import axios from "axios";

const SendFairInvitation = () => {
    const [fairStartDate, setFairStartDate] = useState(null);
    const [fairEndDate, setFairEndDate] = useState(null);
    const [fairStartTime, setFairStartTime] = useState("");
    const [fairEndTime, setFairEndTime] = useState("");
    const [selectingEndDate, setSelectingEndDate] = useState(false); // Toggle between start and end date selection
    const token = localStorage.getItem("userToken");
    const counselorUsername = localStorage.getItem("username");

    const handleDateSelection = (date) => {
        if (!selectingEndDate) {
            // Başlangıç tarihi seçilirken bitiş tarihinden sonra olmamasını kontrol et
            if (fairEndDate && date > fairEndDate) {
                alert("Başlangıç tarihi bitiş tarihinden sonra olamaz!");
            } else {
                setFairStartDate(date);
            }
        } else {
            // Bitiş tarihi seçilirken başlangıç tarihinden önce olmamasını kontrol et
            if (fairStartDate && date < fairStartDate) {
                alert("Bitiş tarihi başlangıç tarihinden önce olamaz!");
            } else {
                setFairEndDate(date);
            }
        }
    };

    const handleSubmit = async () => {
        const requestData = {
            fairInvitation: {
                fairStartDate: fairStartDate?.toLocaleDateString("en-CA"),
                fairEndDate: fairEndDate?.toLocaleDateString("en-CA"),
                fairStartTime,
                fairEndTime,
            },
            counselorUsername: counselorUsername,
        };

        if(requestData.fairInvitation.fairStartDate==null || requestData.fairInvitation.fairEndDate==null) {
            alert("Lütfen fuar başlangıç ve bitiş saati seçiniz!");
        }
        else {
            try {
                const response = await axios.post(
                    "http://localhost:8081/api/fair-invitations/add",
                    requestData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                if (response.status === 201) {
                    alert("Fuar davetiyesi başarıyla oluşturuldu!");

                    setFairEndDate(null)
                    setFairStartDate(null)
                } else if (response.status === 409) {
                    alert("Bu tarihlerde zaten bir davetiye mevcut.");
                } else {
                    alert("Davetiyeyi gönderirken bir hata oluştu.");
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    alert("Bu tarihlerde zaten bir davetiye mevcut.");
                } else if (error.response && error.response.status === 404) {
                    alert("Counselor bulunamadı.");
                } else {
                    alert("Davetiyeyi gönderirken bir hata oluştu.");
                }
                console.error("Error submitting fair invitation:", error);
            }
        }
    };

    const tileClassName = ({ date, view }) => {
        // Highlight the fairStartDate with a red background
        if (view === "month" && fairStartDate && date.toDateString() === fairStartDate.toDateString()) {
            return "highlight-start-date";
        }
        if (view === "month" && fairEndDate && date.toDateString() === fairEndDate.toDateString()) {
            return "highlight-start-date";
        }
        return null;
    };

    return (
        <div className="container">

            <div className="calendar-container">
            <h3>{selectingEndDate ? "Fuar Bitiş Tarihi Seçin:" : "Fuar Başlangıç Tarihi Seçin:"}</h3>

                <Calendar
                    onChange={handleDateSelection}
                    value={selectingEndDate ? fairEndDate : fairStartDate}
                    tileClassName={tileClassName}
                />
                <button
                    className="date-toggle-button"
                    onClick={() => setSelectingEndDate((prev) => !prev)}
                >
                    {selectingEndDate ? "Bitiş Tarihi Seç" : "Başlangıç Tarihi Seç"}
                </button>
                <p className="selected-dates-container">
                    <span className="selected-dates-title">Seçilen Tarihler:</span>
                    <br/>
                    {fairStartDate?.toLocaleDateString("tr-TR") || "__"} -{" "}
                    {fairEndDate?.toLocaleDateString("tr-TR") || "__"}
                </p>

            </div>
            <div className="details-container">
                <label>
                    Başlangıç Saati:
                    <input
                        type="time"
                        value={fairStartTime}
                        onChange={(e) => setFairStartTime(e.target.value)}
                    />
                </label>
                <label>
                    Bitiş Saati:
                    <input
                        type="time"
                        value={fairEndTime}
                        onChange={(e) => setFairEndTime(e.target.value)}
                    />
                </label>
                <button className="submit-button" onClick={handleSubmit}>
                    Davetiyeyi Gönder
                </button>
            </div>
        </div>
    );
};

export default SendFairInvitation;
