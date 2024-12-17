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
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [statusFilter, setStatusFilter] = useState("All"); // Filter status state
    const [toggleState, setToggleState] = useState(false); // Initially false

    const applicationsPerPage = 6; // Limit to 6 applications per page

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
                const counselorEmail = localStorage.getItem("username").toLowerCase();
                const filteredApplications = response.data.filter(
                    (application) => application.applyingCounselorEmail === counselorEmail
                );

                // Sort tour applications based on assignedDate or requestedDates
                const sortedApplications = filteredApplications.sort((a, b) => {
                    const dateA = a.assignedDate
                        ? new Date(a.assignedDate)
                        : new Date(Math.min(...a.requestedDates.map((d) => new Date(d.date).getTime())));
                    const dateB = b.assignedDate
                        ? new Date(b.assignedDate)
                        : new Date(Math.min(...b.requestedDates.map((d) => new Date(d.date).getTime())));
                    return dateB - dateA; // Descending order
                });

                setApplications(sortedApplications);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to fetch tour applications. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, [toggleState]);

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

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                alert("Başvuru başarıyla iptal edildi.");
                setApplications((prevApplications) =>
                    prevApplications.filter((app) => app.id !== applicationId)
                );
                // Toggle to trigger the rerender
                setToggleState((prev) => !prev); // Toggle the state
            }
        } catch (error) {
            console.error("Error canceling application:", error);
            alert("Başvuru iptal edilirken bir hata oluştu.");
        }
    };
    // Function to handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Slice the applications based on the current page and applications per page
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    let currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

    // Filter applications based on the selected status filter
    if (statusFilter !== "All") {
        currentApplications = currentApplications.filter((application) => application.applicationStatus === statusFilter);
    }

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

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button onClick={() => setStatusFilter("All")}>Tüm Başvurular</button>
                <button onClick={() => setStatusFilter("Pending")}>Onay Bekleyenler</button>
                <button onClick={() => setStatusFilter("Approved")}>Onaylananlar</button>
                <button onClick={() => setStatusFilter("Rejected")}>Reddedilenler</button>
                <button onClick={() => setStatusFilter("Cancelled")}>İptal Edilenler</button>
            </div>

            <div className="applications-grid">
                {currentApplications.map((application) => (
                    <div
                        key={application.id}
                        className={`application-card ${
                            application.applicationStatus === "Pending"
                                ? "pending-card"
                                : application.applicationStatus === "Approved"
                                ? "approved-card"
                                : application.applicationStatus === "Rejected" || application.applicationStatus === "Pre-rejected"
                                ? "rejected-card"
                                : application.applicationStatus === "Cancelled"
                                ? "cancelled-card"
                                : ""
                        }`}
                    >
                        <div className="card-status">
                            <span
                                className={`status-badge ${
                                    application.applicationStatus === "Pending"
                                        ? "pending"
                                        : application.applicationStatus === "Approved"
                                        ? "approved"
                                        : application.applicationStatus === "Rejected" || application.applicationStatus === "Pre-rejected"
                                        ? "rejected"
                                        : application.applicationStatus === "Cancelled"
                                        ? "cancelled"
                                        : ""
                                }`}
                            >
                                {statusTranslations[application.applicationStatus] || statusTranslations.default}
                            </span>
                        </div>
                        <div className="card-details">
                            <p>
                                <strong>Başvuru No:</strong> {application.id}
                            </p>
                            <p>
                                <strong>
                                    {application.applicationStatus === "Approved" || application.applicationStatus === "Pending"
                                        ? "Tarih: "
                                        : "Başvurulan Tarihler: "}
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
                                        ?  "": "Saat: "}</strong> {formatTimeSlot(application.selectedTimeSlot)}
                            </p>
                            <p>
                                <strong>Ziyaretçi Sayısı: </strong> {application.visitorCount}
                            </p>
                        </div>

                        <div className="card-actions">
                            {application.applicationStatus !== "Rejected" && application.applicationStatus !== "Pre-rejected"
                                                         && application.applicationStatus !== "Cancelled" && (
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

            {/* Pagination Controls */}
            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </button>
                <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lsaquo;
                </button>
                <span className="pagination-info">Page {currentPage}</span>
                <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * applicationsPerPage >= applications.length}
                >
                    &rsaquo;
                </button>
                <button
                    className="pagination-button"
                    onClick={() => paginate(Math.ceil(applications.length / applicationsPerPage))}
                    disabled={currentPage * applicationsPerPage >= applications.length}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default CounselorTourApplicationsPage;