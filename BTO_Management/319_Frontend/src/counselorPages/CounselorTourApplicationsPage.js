import React from "react";
import { useNavigate } from "react-router-dom";
import "./CounselorTourApplicationsPage.css";

const applications = [
    { id: 1, status: "Onay bekleniyor", date: "25.08.2024", time: "15:30-16:30", canCancel: true },
    { id: 2, status: "Onay bekleniyor", date: "24.08.2024", time: "11:30-12:30", canCancel: true },
    { id: 3, status: "Reddedildi", date: "21.07.2024", time: "10:30-11:30", canCancel: false },
    { id: 4, status: "Reddedildi", date: "20.07.2024", time: "15:30-16:30", canCancel: false },
    { id: 5, status: "Onaylandı", date: "14.07.2024", time: "14:30-15:30", canCancel: false },
    { id: 6, status: "Onaylandı", date: "13.07.2024", time: "14:30-15:20", canCancel: false },
];

const CounselorTourApplicationsPage = () => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        if (applications.find((app) => app.id === id).status !== "Reddedildi") {
            navigate(`/tour-application/${id}`);
        }
    };

    return (
        <div className="applications-container">
            <h2 className="applications-header">Başvurularım</h2>
            <div className="applications-grid">
                {applications.map((application) => (
                    <div
                        key={application.id}
                        className={`application-card ${
                            application.status === "Onay bekleniyor"
                                ? "pending-card"
                                : application.status === "Onaylandı"
                                    ? "approved-card"
                                    : "rejected-card"
                        }`}
                        onClick={() => handleCardClick(application.id)}
                    >
                        <div className="card-status">
                            <span
                                className={`status-badge ${
                                    application.status === "Onay bekleniyor"
                                        ? "pending"
                                        : application.status === "Onaylandı"
                                            ? "approved"
                                            : "rejected"
                                }`}
                            >
                                {application.status}
                            </span>
                        </div>
                        <div className="card-details">
                            <p>
                                <strong>Tarih:</strong> {application.date}
                            </p>
                            <p>
                                <strong>Saat:</strong> {application.time}
                            </p>
                        </div>
                        <div className="card-actions">
                            {application.canCancel ? (
                                <button className="cancel-button active">İptal Et</button>
                            ) : (
                                <button className="cancel-button disabled" disabled>
                                    İptal Et
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination moved below the cards */}
            <div className="pagination-container">
                <button className="pagination-button">&laquo;</button>
                <button className="pagination-button">&lsaquo;</button>
                <button className="pagination-button">&rsaquo;</button>
                <button className="pagination-button">&raquo;</button>
            </div>
        </div>
    );
};

export default CounselorTourApplicationsPage;
