import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdvisorPuantage.css";

const TourGuidePuantage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [guideTours, setGuideTours] = useState([]);
    const [fairs, setFairs] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState({ tours: [], fairs: [] });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityDuration, setActivityDuration] = useState("");
    const [toggleState, setToggleState] = useState(false); // State to force re-render

    const guideEmail = localStorage.getItem("username");
    const token = localStorage.getItem("userToken");
    const navigate = useNavigate();

    const statusTranslations = {
        GuideAssigned: "Rehber Atandı",
        Finished: "Tamamlandı",
        Approved: "Onaylandı",
        Withdrawn: "Çekildi",
        WithdrawRequested: "Çekilme Talep Edildi",
        ExecutiveAndGuideAssigned: "Yönetici ve Rehber Atandı",
        ExecutiveAssigned: "Yönetici Atandı"
    };

    const translateStatusToTurkish = (status) => statusTranslations[status] || status;
    const formatISODate = (date) => date.toLocaleDateString("en-CA");

    // Fetch tours and fairs data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const toursResponse = await axios.get("http://localhost:8081/api/tour/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fairsResponse = await axios.get("http://localhost:8081/api/fair/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const tours = toursResponse.data.filter(
                    (tour) =>
                        (tour.tourStatus === "GuideAssigned" ||
                            tour.tourStatus === "Finished" ||
                            tour.tourStatus === "Withdrawn" ||
                            tour.tourStatus === "WithdrawRequested" ||
                            tour.tourStatus === "AdvisorAssigned")&&
                        tour.assignedGuideEmail === guideEmail
                );

                const fairs = fairsResponse.data.filter(
                    (fair) =>
                        (fair.fairStatus === "Finished" ||
                        fair.fairStatus === "GuideAssigned" ||
                        fair.fairStatus === "ExecutiveAndGuideAssigned") &&
                    fair.assignedGuideEmail === guideEmail
                );

                setGuideTours(tours);
                setFairs(fairs);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, [guideEmail, token, toggleState]);

    // Filter activities (tours and fairs) for the selected date
    useEffect(() => {
        const formattedSelectedDate = formatISODate(selectedDate);

        const toursForDay = guideTours.filter((tour) => tour.chosenDate === formattedSelectedDate);
        const fairsForDay = fairs.filter((fair) => fair.startDate === formattedSelectedDate);

        setFilteredActivities({ tours: toursForDay, fairs: fairsForDay });
    }, [selectedDate, guideTours, fairs]);

    const getTileClassName = ({ date, view }) => {
        if (view !== "month") return null;

        const dateStr = date.toLocaleDateString("en-CA"); // Normalize date to YYYY-MM-DD format

        const hasUnfinishedActivity = guideTours.some(
            (tour) => tour.chosenDate === dateStr && tour.tourStatus !== "Finished"
        ) || fairs.some(
            (fair) => fair.startDate === dateStr && fair.fairStatus !== "Finished"
        );

        const hasActivities = guideTours.some(
            (tour) => tour.chosenDate === dateStr
        ) || fairs.some(
            (fair) => fair.startDate === dateStr
        );

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
            // Fetch all approved payments
            const approvedPaymentsResponse = await axios.get(
                "http://localhost:8081/api/payments/getAll",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const approvedPayments = approvedPaymentsResponse.data.filter(
                (payment) => payment.status === "APPROVED"
            );

            const isActivityInApprovedPayments = approvedPayments.some(
                (payment) => payment.tourId === selectedActivity.id || payment.fairId === selectedActivity.id
            );

            if (isActivityInApprovedPayments) {
                alert("Bu aktivitenin ödemesi onaylandı. Onaylanan aktivitenin süresi değiştirilemez!");
                return;
            }

            const endpoint = selectedActivity.chosenDate
                ? selectedActivity.tourStatus === "Finished"
                    ? "http://localhost:8081/api/tour/edit-activity"
                    : "http://localhost:8081/api/tour/submit-activity"
                : selectedActivity.startDate
                    ? selectedActivity.fairStatus === "Finished"
                        ? "http://localhost:8081/api/fair/edit-fair-activity-guide"
                        : "http://localhost:8081/api/fair/submit-fair-activity-guide"
                    : null;

            if (!endpoint) {
                alert("Geçersiz aktivite durumu. Lütfen kontrol edin.");
                return;
            }

            const params = selectedActivity.chosenDate
                ? { tourId: selectedActivity.id, tourGuideEmail: guideEmail, duration: activityDuration }
                : { fairId: selectedActivity.id, tourGuideEmail: guideEmail, duration: activityDuration };

            await axios.post(
                endpoint,
                null,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

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
                {filteredActivities.tours.length > 0 && (
                    <div>
                        <h4>Turlar:</h4>
                        <ul className="activity-list">
                            {filteredActivities.tours.map((tour) => (
                                <li
                                    key={tour.id}
                                    onClick={() => {
                                        setSelectedActivity(tour);
                                        setActivityDuration(tour.duration || "");
                                    }}
                                    className={`activity-item ${selectedActivity?.id === tour.id ? "selected" : ""}`}
                                >
                                    <span><strong>Tur ID:</strong> {tour.id}</span>
                                    <span><strong>Durum:</strong> {translateStatusToTurkish(tour.tourStatus)}</span>
                                    <span><strong>Süre:</strong> {tour.duration ? `${tour.duration} saat` : "Gönderilmedi"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {filteredActivities.fairs.length > 0 && (
                    <div>
                        <h4>Fuarlar:</h4>
                        <ul className="activity-list">
                            {filteredActivities.fairs.map((fair) => (
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
                )}
                {filteredActivities.tours.length === 0 && filteredActivities.fairs.length === 0 && (
                    <p>Seçilen tarihe ait aktivite bulunmamaktadır.</p>
                )}
            </div>

            {selectedActivity && (
                <div className="activity-input-container">
                    <h4>{selectedActivity.id} Numaralı Aktivite İçin Çalışma Saatinizi Giriniz: </h4>
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

            <div className="puantage-table-button">
                <button onClick={() => navigate("/tourguide-puantage-table/advisor")}>Puantaj Tablosunu Gör</button>
            </div>
        </div>
    );
};

export default TourGuidePuantage;
