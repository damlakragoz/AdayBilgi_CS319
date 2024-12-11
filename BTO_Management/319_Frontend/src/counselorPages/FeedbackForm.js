import React, { useState } from "react";
import "./FeedbackForm.css";

const FeedbackForm = ({ closeFeedback }) => {
    const [rating, setRating] = useState(0);
    const [feedbackDetails, setFeedbackDetails] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [file, setFile] = useState(null);

    const handleRating = (value) => setRating(value);

    const handleFileChange = (event) => setFile(event.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            rating,
            feedbackDetails,
            suggestions,
            file,
        });
        alert("Geri bildirim başarıyla gönderildi!");
        closeFeedback();
    };

    return (
        <div className="feedback-container shadow-sm">
            <h2 className="feedback-header">Etkinlik Geri Bildirimi</h2>
            <div className="feedback-details">
                <h5 className="details-title">Etkinlik Detayları</h5>
                <p><strong>Tarih:</strong> 5 Kasım 2024</p>
                <p><strong>Saat:</strong> 14:00 - 15:00</p>
                <p><strong>Durum:</strong> Tamamlandı</p>
            </div>
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
                    <label className="form-label">Detaylı Geri Bildirim</label>
                    <textarea
                        className="form-control"
                        value={feedbackDetails}
                        onChange={(e) => setFeedbackDetails(e.target.value)}
                        placeholder="Detaylı geri bildiriminizi buraya yazın..."
                        rows="4"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">Öneriler</label>
                    <textarea
                        className="form-control"
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Herhangi bir öneriniz var mı?"
                        rows="2"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">Ekler</label>
                    <input type="file" onChange={handleFileChange} className="form-control-file" />
                    <small className="file-info">Kabul edilen dosya türleri: .jpg, .png, .pdf. Maksimum boyut: 5MB.</small>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">Geri Bildirimi Yolla</button>
                    <button type="button" onClick={closeFeedback} className="btn btn-secondary">Geri Bildirimlerime
                        Dön
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
