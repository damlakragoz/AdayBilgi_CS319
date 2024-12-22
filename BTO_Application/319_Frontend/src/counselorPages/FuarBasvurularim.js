import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../tourguidepages/AllFairs.css";

const FuarBasvurularim = () => {
    const [fairs, setFairs] = useState([]);
    const [enrolledFairs, setEnrolledFairs] = useState([]);
    const [toggleState, setToggleState] = useState(false);
    const token = localStorage.getItem("userToken");

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
                alert("Failed to load fairs. Please try again later.");
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
            <h4 className="tour-list-header">Fuar Başvurularım</h4>
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

                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FuarBasvurularim;
