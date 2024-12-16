import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CounselorTourApplicationsPage.css";

// Status translations
const statusTranslations = {
    Pending: "Onay bekleniyor",
    Approved: "Onaylandı",
    Rejected: "Reddedildi",
    "Pre-rejected": "Reddedildi", // Map Pre-rejected to Reddedildi
    "Cancelled": "Iptal edildi",
    default: "Oluşturuldu", // Handle unexpected statuses
};

// TimeSlot mappings for displaying in a user-friendly format
const timeSlotDisplayNames = {
    SLOT_9_10: "09:00-10:00",
    SLOT_10_11: "10:00-11:00",
    SLOT_11_12: "11:00-12:00",
    SLOT_13_14: "13:00-14:00",
    SLOT_14_15: "14:00-15:00",
};
const CounselorTourApplicationsPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    alert("Authorization token missing. Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:8081/api/tour-applications/getAll", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                const counselorEmail = localStorage.getItem("username");
                const filteredApplications = response.data.filter(
                    (application) => application.applyingCounselorEmail === counselorEmail
                );
                setApplications(filteredApplications);
                console.log(response.data);
                console.log(filteredApplications);
                console.log(response.data[0].applyingCounselorEmail);

            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to fetch tour applications. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

//    const handleCardClick = (id) => {
//        const application = applications.find((app) => app.id === id);
//        if (application && application.status !== "Rejected") {
//            navigate(`/tour-application/${id}`);
//        }
//    };

    // Handle the cancelation of a tour
    const handleCancelTour = async (applicationId) => {
        try {
            const token = localStorage.getItem("userToken");
            const counselorEmail = localStorage.getItem("username");


            console.log(counselorEmail);
            console.log(applicationId);
            const response = await axios.post(
                "http://localhost:8081/api/tour-applications/counselor/cancel",
                null,
                {
                    params: {
                        counselorEmail: counselorEmail,
                        tourApplicationId: applicationId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log(response);

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                alert("Başvuru başarıyla iptal edildi.");
                setApplications((prevApplications) =>
                    prevApplications.filter((app) => app.id !== applicationId)
                );
            }
        } catch (error) {
            console.error("Error canceling application:", error);
            alert("Başvuru iptal edilirken bir hata oluştu.");
        }
    };

    // Function to format LocalDate
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("tr-TR");  // Format in Turkish locale (dd.MM.yyyy)
    };

    // Function to format TimeSlot enum
    const formatTimeSlot = (timeSlot) => {
        return timeSlotDisplayNames[timeSlot] || timeSlot;  // Default to enum value if not found
    };

    if (isLoading) {
        return <div className="loading">Loading applications...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="applications-container">
            <h2 className="applications-header">Başvurularım</h2>
            <div className="applications-grid">
                {applications.map((application) => (
                    <div
                        key={application.id}
                        className={`application-card ${
                            application.applicationStatus === "Pending"
                                ? "pending-card"
                                : application.applicationStatus === "Approved"
                                ? "approved-card"
                                : "rejected-card"
                        }`}
                    >
                        <div className="card-status">
                            <span
                                className={`status-badge ${
                                    application.applicationStatus === "Pending"
                                        ? "pending"
                                        : application.applicationStatus === "Approved"
                                        ? "approved"
                                        : "rejected"
                                }`}
                            >
                                {/* Translate the status */}
                                {statusTranslations[application.applicationStatus] || statusTranslations.default}
                            </span>
                        </div>
                        <div className="card-details">
                            <p>
                                <strong>Başvuru No:</strong> {application.applicationId}
                            </p>
                            <p>
                                <strong>
                                    {application.applicationStatus === "Approved" || application.applicationStatus === "Pending"
                                        ? "Tarih:"  // Show "Tarih" if Approved
                                        : "Başvurulan Tarihler:"}  {/* Show "Başvurulan Tarihler" if Rejected or Pre-rejected */}
                                </strong>
                                {application.applicationStatus === "Pre-rejected" || application.applicationStatus === "Rejected"  || application.applicationStatus === "Created"
                                    ? Array.isArray(application.requestedDates)
                                        ? application.requestedDates
                                            .map((requestedDate) => `${formatDate(requestedDate.date)} ${formatTimeSlot(requestedDate.timeSlot)}`)
                                            .join(", ")
                                        : `${formatDate(application.requestedDates.date)} ${formatTimeSlot(application.requestedDates.timeSlot)}`
                                    : formatDate(application.selectedDate)}
                            </p>
                            <p>
                                <strong> {application.applicationStatus === "Pre-rejected" || application.applicationStatus === "Rejected" || application.applicationStatus === "Created"
                                        ?  "": "Saat:"}</strong> {formatTimeSlot(application.selectedTimeSlot)}
                            </p>
                            <p>
                                <strong>Ziyaretçi Sayısı:</strong> {application.visitorCount}
                            </p>
                        </div>

                        <div className="card-actions">
                            {/* Conditionally render the Cancel button based on application status */}
                            {application.applicationStatus == "Pending" && application.applicationStatus == "Approved" && (
                                <button
                                    className="cancel-button"
                                    onClick={(event) => handleCancelTour(application.id, event)}
                                >
                                    İptal Et
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

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
