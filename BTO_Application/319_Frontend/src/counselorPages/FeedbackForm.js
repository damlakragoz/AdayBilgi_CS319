import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackForm.css";

const FeedbackForm = ({ closeFeedback, tourId }) => {
    const [rating, setRating] = useState(0);
    const [feedbackDetails, setFeedbackDetails] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [tourDetails, setTourDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const timeSlotDisplayNames = {
            SLOT_9_10: "09:00-10:00",
            SLOT_10_11: "10:00-11:00",
            SLOT_11_12: "11:00-12:00",
            SLOT_13_14: "13:00-14:00",
            SLOT_14_15: "14:00-15:00",
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Disable the button

        console.log(tourDetails.id);
        console.log(rating);
        console.log(suggestions);

        const counselorEmail = localStorage.getItem("username");
        console.log(counselorEmail);

        const token = localStorage.getItem("userToken");
        axios.post('http://localhost:8081/api/feedback/submit',
            null,
            {
                params: {
                    tourId: tourDetails.id,
                    rating: rating,
                    comment:  "Feedback: "+ feedbackDetails+ " Suggestions: "+ suggestions,
                    counselorEmail: counselorEmail,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })

            .then((response) => {
                alert("Geri bildirim başarıyla gönderildi!");
                setLoading(false); // Enable the button
                closeFeedback();
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
                setLoading(false); // Enable the button
            });
    };

    // Fetch tour details when the component mounts
    const fetchTourDetails = async (tourId) => {
        try {
            const token = localStorage.getItem("userToken");
            // Log the necessary values to check
            console.log("Tour ID:", tourId);

            const response = await axios.get("http://localhost:8081/api/tour/getById", {
                params: {
                    tourId: tourId, // Pass the tourId as a query parameter
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token for authorization if needed
                    "Content-Type": "application/json",
                },
                withCredentials: true, // Include credentials if necessary
            });

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                console.log("Tour Details:", response.data);
                // You can set the fetched data to your component state here
                setTourDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching tour details:", error);
            alert("Etkinlik detayları alınırken bir hata oluştu.");
        }
    };

    useEffect(() => {
        if (tourId) {
            fetchTourDetails(tourId);
        }
    }, [tourId]);

    const formatDate = (date) => {
            return new Date(date).toLocaleDateString("tr-TR");
        };

    const formatTimeSlot = (timeSlot) => {
        return timeSlotDisplayNames[timeSlot] || timeSlot;
    };

    const handleRating = (value) => setRating(value);

    return (
        <div className="feedback-container shadow-sm">
            <h2 className="feedback-header">Etkinlik Geri Bildirimi</h2>
            {tourDetails && (
                <div className="feedback-details">
                    <h5 className="details-title">Tamamlanan Turun Etkinlik Detayları</h5>
                    <p><strong>Tarih:</strong> {formatDate(tourDetails.chosenDate)}</p>
                    <p><strong>Saat:</strong> {formatTimeSlot(tourDetails.chosenTimeSlot)}</p>
                </div>
            )}
            <div className="rating">
                <h5>Oy</h5>
                <div className="stars-container">
                    {[...Array(5)].map((_, i) => (
                        <i
                            key={i}
                            className={`fas fa-star ${i < rating ? "active-star" : ""}`}
                            onClick={() => handleRating(i + 1)}
                        ></i>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="feedback-form-label">Detaylı Geri Bildirim</label>
                    <textarea
                        className="form-control"
                        value={feedbackDetails}
                        onChange={(e) => setFeedbackDetails(e.target.value)}
                        placeholder="Detaylı geri bildiriminizi buraya yazın..."
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="feedback-form-label">Öneriler</label>
                    <textarea
                        className="form-control"
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Herhangi bir öneriniz var mı?"
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Gönderiliyor..." : "Geri Bildirimi Yolla"}
                    </button>
                    <button type="button" onClick={closeFeedback} className="feedback-btn-secondary">Geri Bildirimlerime
                        Dön
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
