import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FeedbacksPage.css"; // Add CSS file for styling
import { useNavigate } from "react-router-dom";

toast.configure();

const FeedbacksPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const counselorEmail = localStorage.getItem("username").toLowerCase();

                if (!token || !counselorEmail) {
                    toast.error("Yetkilendirme hatası. Lütfen tekrar giriş yapın.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8081/api/feedback/getAll",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Filter feedbacks by counselor email
                const counselorFeedbacks = response.data.filter(
                    (feedback) => feedback.counselor.email.toLowerCase() === counselorEmail
                );

                setFeedbacks(counselorFeedbacks);
            } catch (error) {
                console.error("Error fetching feedbacks: ", error.message);
                setError("Geri bildirimler yüklenirken bir hata oluştu.");
                toast.error("Geri bildirimler yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [navigate]);

    if (loading) {
        return <div className="loading">Geri bildirimler yükleniyor...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="feedbacks-container">
            <h2 className="feedbacks-header">Geri Bildirimlerim</h2>

            {feedbacks.length === 0 ? (
                <p>Henüz geri bildirim göndermediniz.</p>
            ) : (
                <table className="feedbacks-table">
                    <thead>
                    <tr>
                        <th>Tur ID</th>
                        <th>Puan</th>
                        <th>Yorum</th>
                        <th>Tarih</th>
                    </tr>
                    </thead>
                    <tbody>
                    {feedbacks.map((feedback) => (
                        <tr key={feedback.feedbackId}>
                            <td>{feedback.tour.id}</td>
                            <td>{"\u2605".repeat(feedback.rating)}{" "}{"\u2606".repeat(5 - feedback.rating)}</td>
                            <td>{feedback.comment || "Yorum bulunmamaktadır."}</td>
                            <td>{new Date(feedback.tour.selectedDate).toLocaleDateString("tr-TR")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FeedbacksPage;
