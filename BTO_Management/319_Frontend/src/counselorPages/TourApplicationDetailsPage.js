import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TourApplicationDetailsPage.css";

const TourApplicationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    useEffect(() => {
        // Simulate API fetch or data loading
        const fetchedApplication = {
            id,
            status: id === "5" || id === "6" ? "Onaylandı" : "Onay bekleniyor", // Example data for approved/rejected
            date: "25.08.2024",
            time: "15:30-16:30",
            canCancel: id !== "5" && id !== "6", // Example data to disable cancel for "Onaylandı"
        };
        setApplication(fetchedApplication);
    }, [id]);

    const handleSave = () => {
        // Logic to save the updated application
        alert("Başvuru başarıyla güncellendi!");
        navigate("/applications");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplication((prev) => ({ ...prev, [name]: value }));
    };

    if (!application) {
        return <div>Loading Application Details...</div>;
    }

    if (application.status === "Onaylandı") {
        return (
            <div className="application-details-container">
                <h2>Başvuru Detayları</h2>
                <form>
                    <div className="form-group">
                        <label>Durum</label>
                        <input
                            type="text"
                            value={application.status}
                            disabled
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Tarih</label>
                        <input
                            type="date"
                            name="date"
                            value={application.date}
                            disabled
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Saat</label>
                        <input
                            type="time"
                            name="time"
                            value={application.time}
                            disabled
                            className="form-control"
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate("/applications")}
                            className="cancel-button"
                        >
                            Geri Dön
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="application-details-container">
            <h2>Başvuru Detayları</h2>
            <form>
                <div className="form-group">
                    <label>Durum</label>
                    <input
                        type="text"
                        value={application.status}
                        disabled
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Tarih</label>
                    <input
                        type="date"
                        name="date"
                        value={application.date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Saat</label>
                    <input
                        type="time"
                        name="time"
                        value={application.time}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={handleSave} className="save-button">
                        Kaydet
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/applications")}
                        className="cancel-button"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TourApplicationDetailsPage;
