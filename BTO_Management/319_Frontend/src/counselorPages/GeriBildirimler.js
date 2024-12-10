import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";

const GeriBildirimler = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const feedbacks = [
        { status: "Geri donüt bekleniyor", activity: "Tur", date: "25.08.2023", time: "11.30-12.30", stars: 0 },
        { status: "Geri donüt verildi", activity: "Fuar", date: "20.07.2022", time: "15.30-16.30", stars: 3 },
    ];

    if (showFeedbackForm) {
        return <FeedbackForm closeFeedback={() => setShowFeedbackForm(false)} />;
    }

    return (
        <div>
            <h2>Geri Bildirimlerim</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Durum</th>
                    <th>Aktivite</th>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th>Oy</th>
                    <th>Geri Bildirim</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.map((feedback, index) => (
                    <tr key={index}>
                        <td>{feedback.status}</td>
                        <td>{feedback.activity}</td>
                        <td>{feedback.date}</td>
                        <td>{feedback.time}</td>
                        <td>
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fas fa-star ${i < feedback.stars ? "text-warning" : "text-secondary"}`}
                                ></i>
                            ))}
                        </td>
                        <td>
                            <i
                                className="fas fa-pen text-primary"
                                onClick={() => setShowFeedbackForm(true)}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GeriBildirimler;
