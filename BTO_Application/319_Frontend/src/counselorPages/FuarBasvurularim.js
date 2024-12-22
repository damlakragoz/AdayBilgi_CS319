import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../tourguidepages/AllFairs.css";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";


const FuarBasvurularim = () => {
    const [fairs, setFairs] = useState([]);
    const [enrolledFairs, setEnrolledFairs] = useState([]);
    const [toggleState, setToggleState] = useState(false);
    const token = localStorage.getItem("userToken");
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [statusFilter, setStatusFilter] = useState("All"); // Filter status state


    // Map status from English to Turkish
    const mapStatusToTurkish = (status) => {
        const normalizedStatus = status ? status.trim().toLowerCase() : "not_specified";
        return statusMap[normalizedStatus] || statusMap["not_specified"]; // Default to "Belirtilmedi" if not found
    };

    // Mapping of fair invitation status in English to Turkish
    const statusMap = {
        "pending": "Kayıt bekliyor",
        "created": "Oluşturuldu",
        "approved": "Onaylandı",
        "rejected": "Reddedildi",
        "cancelled": "İptal Edildi",
        "finished": "Tamamlandı",
        "executiveassigned": "Yönetici Başvurdu",
        "executiveandguideAssigned": "Yönetici ve Tur Rehberi Başvurdu",
        "tourguideAssigned": "Tur Rehberi Başvurdu",
        "not_specified": "-",
    };

    // Format the date to Turkish format
    const formatDate = (date) => {
        if (!date) return "Geçersiz Tarih"; // Handle null or undefined
        try {
            // If the date is a Date object, we can directly format it
            if (date instanceof Date) {
                return new Intl.DateTimeFormat('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(date);
            }

            // Otherwise, handle string format (expected format: 'YYYY-MM-DD')
            const [year, month, day] = date.split('-');
            const parsedDate = new Date(year, month - 1, day); // Create a Date object for formatting
            return new Intl.DateTimeFormat('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(parsedDate); // Format in Turkish
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Geçersiz Tarih";
        }
    };

    // Handle the cancelation of a tour
    const handleCancelFair = async (fairInvitationId) => {
        try {
            const token = localStorage.getItem("userToken");
            const counselorEmail = localStorage.getItem("username").toLowerCase();

            console.log("Counselor Email:", counselorEmail);
            console.log("Fair Invitation ID:", fairInvitationId);

            const response = await axios.put(
                "http://localhost:8081/api/fair-invitations/counselor/cancel",
                null,
                {
                    params: {
                        counselorEmail: counselorEmail,
                        fairInvitationId: fairInvitationId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );


            console.log("Response Status:", response.status);
            console.log("Response Data:", response.data);

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                toast.info("Davetiye başarıyla iptal edildi.");

                setApplications((prevApplications) =>
                    prevApplications.filter((app) => app.fairInvitationId !== fairInvitationId)
                );
                // Toggle to trigger the rerender
                setToggleState((prev) => !prev); // Toggle the state
                toast.dismiss()
            }
        } catch (error) {
            console.error("Error canceling invitation:", error);
            toast.error("Başvuru iptal edilirken bir hata oluştu.");
        }
    };
    // Fetch all fairs
    useEffect(() => {
        const fetchFairs = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    alert("Authorization token missing. Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:8081/api/fair-invitations/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data)
                if (response.status === 200) {
                    setFairs(response.data);
                }
            } catch (error) {
                console.error("Error canceling invitation:", error.response?.data || error.message);
                toast.error(`Başvuru iptal edilirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
            }

        };

        fetchFairs();
    }, [toggleState]);

    // Sort fairs into prioritized categories and by nearest date
    const sortedFairs = useMemo(() => {
        return fairs
            .map((fair) => ({
                ...fair,
                dateObj: new Date(fair.chosenDate), // Parse date for sorting
            }))
            .sort((a, b) => {
                const getCategory = (fair) => {
                    if (
                        fair.fairStatus === "Pending" ||
                        fair.fairStatus === "ExecutiveAndGuideAssigned" ||
                        fair.fairStatus === "ExecutiveAssigned"
                    ) {
                        return 1; // Enrollable fairs
                    }
                    return 2; // Default fallback
                };
                const categoryDiff = getCategory(a) - getCategory(b);
                if (categoryDiff !== 0) {
                    return categoryDiff; // Sort by category first
                }
                // If in the same category, sort by date (earliest first)
                return a.dateObj - b.dateObj;
            });
    }, [fairs, enrolledFairs]);



    return (
        <div className="fair-schedule-container">
            <h2 className="tour-list-header">Fuar Davetlerim</h2>
            <ul className="fair-list">
                {sortedFairs.map((fair) => {
                    const isUserEnrolled = enrolledFairs.some(
                        (enrolledFair) => enrolledFair.id === fair.id
                    );
                    return (
                        <li key={fair.id} className="tour-item" data-status={fair.fairInvitationStatus}>
                            <p>
                                <strong>Tarih:</strong> {formatDate(new Date(fair.fairStartDate))} - {formatDate(new Date(fair.fairEndDate))}

                            </p>
                            <p>
                                <strong>Durum:</strong> {mapStatusToTurkish(fair.fairInvitationStatus)}
                            </p>

                            <div className="card-actions">
                                {/* Conditionally render the Cancel button based on application status */}
                                {(fair.fairInvitationStatus !== "Rejected" && fair.fairInvitationStatus !== "Cancelled" && fair.fairInvitationStatus !== "Finished") && (
                                    <button
                                        className="cancel-button"
                                        onClick={(event) => {
                                            toast.warn("Fuar davetini iptal etmek istediğinizden emin misiniz?", {
                                                position: "top-center",
                                                style: {width: "400px"},
                                                autoClose: true,
                                                closeOnClick: false,
                                                draggable: false,
                                                color: "red",
                                                onOpen: () => {
                                                },
                                                closeButton: (
                                                    <div style={{display: 'flex', gap: '10px'}}>
                                                        <button onClick={() => handleCancelFair(fair.id)}
                                                                style={{
                                                                    flex: 1,
                                                                    padding: '8px 12px',
                                                                    border: 'none',
                                                                    backgroundColor: '#f0f0f0',
                                                                    borderRadius: '4px',
                                                                    display: 'inline-block',
                                                                    whiteSpace: 'nowrap'
                                                                }}>Evet
                                                        </button>
                                                        <button onClick={() => toast.dismiss()} style={{
                                                            flex: 1,
                                                            padding: '8px 12px',
                                                            border: 'none',
                                                            backgroundColor: '#f0f0f0',
                                                            borderRadius: '4px',
                                                            display: 'inline-block',
                                                            whiteSpace: 'nowrap'
                                                        }}>Hayır
                                                        </button>
                                                    </div>
                                                )
                                            });
                                        }}
                                    >
                                        İptal Et
                                    </button>
                                )}
                            </div>

                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FuarBasvurularim;
