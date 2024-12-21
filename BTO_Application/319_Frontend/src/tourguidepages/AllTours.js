import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./AllTours.css";

const AllTours = () => {
    const [tours, setTours] = useState([]);
    const [enrolledTours, setEnrolledTours] = useState([]);
    const [toggleState, setToggleState] = useState(false);

    const formatISODate = (date) => {
        return typeof date === "string" ? date : date.toLocaleDateString("en-CA");
    };

    // Fetch all tours
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    alert("Authorization token missing. Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:8081/api/tour/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setTours(response.data);
                }
            } catch (error) {
                console.error("Error fetching tours:", error.message);
                alert("Failed to load tours. Please try again later.");
            }
        };

        fetchTours();
    }, [toggleState]);

    // Fetch enrolled tours
    useEffect(() => {
        const fetchEnrolledTours = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const guideEmail = localStorage.getItem("username");
                if (!token || !guideEmail) {
                    alert("Authorization or user email missing. Please log in.");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8081/api/tourguide/get/enrolledTours",
                    {
                        params: { guideEmail },
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );

                if (response.status === 200) {
                    setEnrolledTours(response.data);
                }
            } catch (error) {
                console.error("Error fetching enrolled tours:", error.message);
            }
        };

        fetchEnrolledTours();
    }, [toggleState]);

    // Sort tours into prioritized categories and by nearest date
    const sortedTours = useMemo(() => {
        return tours
            .map((tour) => ({
                ...tour,
                dateObj: new Date(tour.chosenDate), // Parse date for sorting
            }))
            .sort((a, b) => {
                const getCategory = (tour) => {
                    if (
                        tour.tourStatus === "Approved" ||
                        tour.tourStatus === "Withdrawn" ||
                        tour.tourStatus === "WithdrawRequested"
                    ) {
                        return 1; // Enrollable tours
                    }
                    if (tour.tourStatus === "GuideAssigned") {
                        const isUserEnrolled = enrolledTours.some(
                            (enrolledTour) => enrolledTour.id === tour.id
                        );
                        return isUserEnrolled ? 2 : 3; // Withdrawable first, then other GuideAssigned
                    }
                    if (tour.tourStatus === "AdvisorAssigned") return 4; // Advisor assigned tours
                    if (tour.tourStatus === "Completed") return 5; // Finished tours
                    return 6; // Default fallback
                };

                const categoryDiff = getCategory(a) - getCategory(b);
                if (categoryDiff !== 0) {
                    return categoryDiff; // Sort by category first
                }

                // If in the same category, sort by date (earliest first)
                return a.dateObj - b.dateObj;
            });
    }, [tours, enrolledTours]);

    const handleEnroll = async (tourId) => {
        const applyingGuideEmail = localStorage.getItem("username");

        if (!applyingGuideEmail) {
            alert("Guide email not found. Please log in again.");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const response = await axios.post(
                "http://localhost:8081/api/tour/enroll",
                { tourId, applyingGuideEmail },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Enrollment successful!");
                setToggleState((prev) => !prev);
            }
        } catch (error) {
            console.error("Error enrolling in the tour:", error.response || error.message);
        }
    };

    const handleRequestWithdraw = async (tourId) => {
        const applyingGuideEmail = localStorage.getItem("username");

        if (!applyingGuideEmail) {
            alert("Guide email not found. Please log in again.");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const response = await axios.post(
                "http://localhost:8081/api/tour/request-withdraw",
                { tourId, applyingGuideEmail },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Withdraw request successful!");
                setToggleState((prev) => !prev);
            }
        } catch (error) {
            console.error("Error requesting withdrawal:", error.response || error.message);
        }
    };

    return (
        <div className="tour-schedule-container">
            <h4 className="tour-list-header">Available Tours</h4>
            <ul className="tour-list">
                {sortedTours.map((tour) => {
                    const isUserEnrolled = enrolledTours.some(
                        (enrolledTour) => enrolledTour.id === tour.id
                    );
                    const canEnroll =
                        tour.tourStatus === "Approved" ||
                        tour.tourStatus === "Withdrawn" ||
                        tour.tourStatus === "WithdrawRequested";

                    return (
                        <li
                            key={tour.id}
                            className="tour-item"
                            data-status={tour.tourStatus}
                        >
                            <p>
                                <strong>Tarih:</strong> {formatISODate(new Date(tour.chosenDate))}
                            </p>
                            <p>
                                <strong>Tur Durumu:</strong> {tour.tourStatus}
                            </p>
                            <p>
                                <strong>Ziyaretçi Sayısı:</strong> {tour.visitorCount}
                            </p>
                            {isUserEnrolled && tour.tourStatus === "GuideAssigned" ? (
                                <button
                                    onClick={() => handleRequestWithdraw(tour.id)}
                                    className="withdraw-button"
                                >
                                    Request Withdraw
                                </button>
                            ) : (
                                canEnroll && (
                                    <button
                                        onClick={() => handleEnroll(tour.id)}
                                        className="enroll-button"
                                    >
                                        Enroll
                                    </button>
                                )
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AllTours;
