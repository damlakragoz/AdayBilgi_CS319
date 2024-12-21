import React, { useState, useEffect } from "react";
import FeedbackForm from "./FeedbackForm";
import "./GeriBildirimler.css";
import axios from "axios";

const GeriBildirimler = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [tours, setTours] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [counselor, setCounselor] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFeedbackList, setShowFeedbackList] = useState(true);

    const toggleFeedbackList = () => {
        setShowFeedbackList((prev) => !prev);
    };


    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const timeSlotDisplayNames = {
        SLOT_9_10: "09:00-10:00",
        SLOT_10_11: "10:00-11:00",
        SLOT_11_12: "11:00-12:00",
        SLOT_13_14: "13:00-14:00",
        SLOT_14_15: "14:00-15:00",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCounselorInformation();
                await fetchFeedbacks();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (counselor?.schoolName) {
            fetchTours();
        }
        toggleFeedbackList;
    }, [counselor]);

    const viewDetails = (tourId) => {
        const feedback = feedbacks.find((fb) => fb.tour.id === tourId);
        if (feedback) {
            setSelectedFeedback(feedback);
            setShowPopup(true);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedFeedback(null);
    };

    const fetchCounselorInformation = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const resp = await axios.get("http://localhost:8081/api/counselors/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const counselorEmail = localStorage.getItem("username")?.toLowerCase();
            if (!counselorEmail) {
                console.log("Counselor email is missing.");
            }

            const filteredCounselors = resp.data.filter(
                (counselor) => counselor.email?.toLowerCase() === counselorEmail
            );

            if (filteredCounselors.length > 0) {
                setCounselor(filteredCounselors[0]);
            } else {
                console.warn("No counselor found with the provided email.");
                setCounselor(null);
            }
        } catch (error) {
            console.error("Error fetching counselors:", error);
        }
    };

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const response = await axios.get("http://localhost:8081/api/tour/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            let filteredTours = response.data.filter(
                (tour) => tour.applyingHighschoolName === counselor.schoolName
            );

            filteredTours = filteredTours.filter(
                (tour) => tour.tourStatus == "Finished" || tour.tourStatus == "Approved"
            );

            const sortedTours = filteredTours.sort((a, b) => {
                const dateA = new Date(a.chosenDate);
                const dateB = new Date(b.chosenDate);
                return dateB - dateA; // Descending order
            });

            setTours(sortedTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setIsLoading(false);
            setShowFeedbackList((prev) => !prev);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }
            const response = await axios.get("http://localhost:8081/api/feedback/getAll", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setFeedbacks(response.data);
        } catch (error) {
            console.log("Error fetching feedbacks:"+error);
        }
    };

    const hasFeedbackForTour = (tourId) => {
        return feedbacks.some((feedback) => (feedback.tour).id == tourId);
    };

    const getRatingForTour = (tourId) => {
        const feedback = feedbacks.find((feedback) => feedback.tour.id === tourId);
        return feedback ? feedback.rating : 0;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("tr-TR");
    };

    const formatTimeSlot = (timeSlot) => {
        return timeSlotDisplayNames[timeSlot] || timeSlot;
    };

    const handlePenClick = (tourId) => {
        setSelectedTourId(tourId);
        setShowFeedbackForm(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (showFeedbackForm) {
        return (
            <FeedbackForm
                closeFeedback={() => setShowFeedbackForm(false)}
                tourId={selectedTourId}
            />
        );
    }

    const formatFeedbackComment = (comment) => {
        if (!comment) return { yorum: "-", oneri: "-" };

        // Extract Yorum and Öneri using regular expressions
        const yorumMatch = comment.match(/Yorum:\s*(.*?)\s*Öneri:/i);
        const oneriMatch = comment.match(/Öneri:\s*(.*)$/i);

        return {
            yorum: yorumMatch ? yorumMatch[1].trim() : "-",
            oneri: oneriMatch ? oneriMatch[1].trim() : "-",
        };
    };

    return (
        <div className="manager-feedbacks-container">
            <h2>Geri Bildirimlerim</h2>
            <table className="fb-activity-table">
                <thead>
                    <tr>
                        <th>Tur Durumu</th>
                        <th>Geri Bildirim</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Oy</th>
                        <th>Düzenle</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour) => (
                        <tr key={tour.id}>
                            <td>{tour.tourStatus=="Finished" ? "Tamamlandı" : "Tur henüz gerçekleşmedi"}</td>
                            <td>
                                {hasFeedbackForTour(tour.id)
                                    ? "Geri bildirim verildi"
                                    : "Geri bildirim bekleniyor"}
                            </td>
                            <td>{formatDate(tour.chosenDate)}</td>
                            <td>{formatTimeSlot(tour.chosenTimeSlot)}</td>
                            <td>
                                {[...Array(5)].map((_, i) => {
                                    const rating = getRatingForTour(tour.id);
                                    if (i < Math.floor(rating)) {
                                        return <i key={i} className="fas fa-star text-warning"></i>;
                                    } else {
                                        return <i key={i} className="fas fa-star text-secondary"></i>;
                                    }
                                })}
                            </td>
                            <td>
                                 {!hasFeedbackForTour(tour.id) &&
                                    tour.tourStatus == "Finished" && (
                                        <i
                                            className="fas fa-pen text-primary"
                                            onClick={() => handlePenClick(tour.id)}
                                            style={{
                                                color: "#2c7a7b",
                                                cursor: "pointer",
                                            }}
                                        ></i>
                                    )}
                                 {hasFeedbackForTour(tour.id) && (
                                         <button
                                              onClick={() => viewDetails(tour.id)}
                                              style={{
                                                         padding: "0px 5px",
                                                         border: "1px solid #ddd",
                                                         background: "#f4f4f4",
                                                         cursor: "pointer",

                                                         margin: "0px 20px"
                                                     }}
                                         >
                                             Detayları Gör
                                         </button>
                                     )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPopup && selectedFeedback && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="popup-close-icon" onClick={closePopup}>
                            &times;
                        </span>
                        <h3>Geribildirim Detayları</h3>
                        <p><strong>Oy:</strong> {selectedFeedback.rating} yıldız</p>
                        {(() => {
                            const { yorum, oneri } = formatFeedbackComment(selectedFeedback.comment);
                            return (
                                <>
                                    <p><strong>Yorum:</strong> {yorum}</p>
                                    <p><strong>Öneri:</strong> {oneri}</p>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeriBildirimler;
