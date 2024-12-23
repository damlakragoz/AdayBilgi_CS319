import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SubmitFairActivity.css";

const SubmitFairActivity = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fairs, setFairs] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDuration, setActivityDuration] = useState("");
    const [toggleState, setToggleState] = useState(false); // State to force re-render

    const executiveEmail = localStorage.getItem("username");
    const token = localStorage.getItem("userToken");
    const navigate = useNavigate();

    const statusTranslations = {
        Finished: "Tamamlandı",
        ExecutiveAssigned: "Yönetici Atandı",
    };

    const translateStatusToTurkish = (status) => statusTranslations[status] || status;
    const formatISODate = (date) => date.toLocaleDateString("en-CA");

    // Fetch fairs data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fairsResponse = await axios.get("http://localhost:8081/api/fair/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fairs = fairsResponse.data.filter(
                    (fair) =>
                        (fair.fairStatus === "Finished" ||
                            fair.fairStatus === "ExecutiveAssigned") &&
                        fair.assignedExecutiveEmail.toLowerCase() === executiveEmail.toLowerCase() &&
                        fair.assignedGuideEmail === null
                );
                console.log(fairs)
                setFairs(fairs);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, [token, toggleState]);

    // Filter fairs for the selected date
    useEffect(() => {
        const formattedSelectedDate = formatISODate(selectedDate);

        const fairsForDay = fairs.filter((fair) => fair.startDate === formattedSelectedDate);

        setFilteredActivities(fairsForDay);
    }, [selectedDate, fairs]);

    const getTileClassName = ({ date, view }) => {
        if (view !== "month") return null;

        const dateStr = date.toLocaleDateString("en-CA"); // Normalize date to YYYY-MM-DD format

        const hasUnfinishedActivity = fairs.some(
            (fair) => fair.startDate === dateStr && fair.fairStatus !== "Finished"
        );

        const hasActivities = fairs.some((fair) => fair.startDate === dateStr);

        if (hasActivities) {
            return hasUnfinishedActivity ? "calendar-unfinished" : "calendar-finished";
        }

        return null; // No activity on this date
    };

    const handleSubmitDuration = async () => {
        if (!selectedActivity || !activityDuration || activityDuration <= 0) {
            alert("Lütfen bir aktivite seçin ve geçerli bir süre girin.");
            return;
        }

        try {
            const endpoint = selectedActivity.startDate
                ? selectedActivity.fairStatus === "Finished"
                    ? "http://localhost:8081/api/fair/edit-fair-activity-executive"
                    : "http://localhost:8081/api/fair/submit-fair-activity-executive"
                : null;

            if (!endpoint) {
                alert("Geçersiz aktivite durumu. Lütfen kontrol edin.");
                return;
            }

            const params = { fairId: selectedActivity.id, executiveEmail: executiveEmail, duration: activityDuration };

            await axios.post(endpoint, null, {
                params: params,
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Aktivite başarıyla güncellendi!");

            setSelectedActivity(null);
            setActivityDuration("");
            setToggleState((prev) => !prev); // Toggle state to trigger re-render
        } catch (error) {
            console.error("Error submitting activity duration:", error.message);
            alert("Aktivite süresi gönderilemedi. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="puantage-container">
            <div className="calendar-container">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    locale="tr-TR"
                    tileClassName={getTileClassName}
                />
            </div>

            <div className="activity-list-container">
                <h3>{selectedDate.toLocaleDateString("tr-TR")} Tarihindeki Aktiviteler:</h3>
                {filteredActivities.length > 0 ? (
                    <div>
                        <h4>Fuarlar:</h4>
                        <ul className="activity-list">
                            {filteredActivities.map((fair) => (
                                <li
                                    key={fair.id}
                                    onClick={() => {
                                        setSelectedActivity(fair);
                                        setActivityDuration(fair.duration || "");
                                    }}
                                    className={`activity-item ${selectedActivity?.id === fair.id ? "selected" : ""}`}
                                >
                                    <span><strong>Fuar ID:</strong> {fair.id}</span>
                                    <span><strong>Durum:</strong> {translateStatusToTurkish(fair.fairStatus)}</span>
                                    <span><strong>Süre:</strong> {fair.duration ? `${fair.duration} saat` : "Gönderilmedi"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Seçilen tarihe ait aktivite bulunmamaktadır.</p>
                )}
            </div>

            {selectedActivity && (
                <div className="activity-input-container">
                    <h4>{selectedActivity.id} Numaralı Aktivite İçin Çalışma Saatinizi Giriniz:</h4>
                    <label>
                        Süre (saat):
                        <input
                            type="number"
                            value={activityDuration}
                            onChange={(e) => setActivityDuration(e.target.value)}
                            placeholder="Süre giriniz"
                            min="0.5"
                            step="0.5"
                        />
                    </label>
                    <button onClick={handleSubmitDuration}>
                        Aktiviteyi Tamamla
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubmitFairActivity;
