import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../tourguidepages/AllFairs.css";

const AllFairsBTOManager = () => {
    const [fairs, setFairs] = useState([]);
    const [enrolledFairs, setEnrolledFairs] = useState([]);
    const [toggleState, setToggleState] = useState(false);
    const token = localStorage.getItem("userToken");

    const formatISODate = (date) => {
        if (!date) return "--";
        return typeof date === "string" ? date : date.toLocaleDateString("en-CA");
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

                const response = await axios.get("http://localhost:8081/api/fair/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setFairs(response.data);
                }
            } catch (error) {
                alert("Failed to load fairs. Please try again later.");
            }
        };

        fetchFairs();
    }, [toggleState]);

    // Fetch enrolled tours
    useEffect(() => {
       const fetchEnrolledFairs = async () => {
           try {
               const token = localStorage.getItem("userToken");
               const executiveEmail = localStorage.getItem("username"); // Retrieve the email here

               if (!token || !executiveEmail) {
                   alert("Authorization token or executive email is missing. Please log in.");
                   return;
               }

               const response = await axios.get("http://localhost:8081/api/fair/getAll", {
                   headers: { Authorization: `Bearer ${token}` },
               });

               if (response.status === 200) {
                   console.log(response.data); // Log all fairs for debugging
                   const filteredFairs = response.data.filter(
                       (fair) =>
                           (fair.assignedExecutiveEmail &&
                           fair.assignedExecutiveEmail.toLowerCase() === executiveEmail.toLowerCase())
                   );
                   console.log(filteredFairs); // Log the filtered fairs for debugging
                   setEnrolledFairs(filteredFairs);
               }
           } catch (error) {
               alert("Failed to load fairs. Please try again later.");
               console.error("Error fetching fairs:", error.message);
           }
       };
       fetchEnrolledFairs();
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
                        fair.fairStatus === "TourGuideAssigned"
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

    const handleEnroll = async (fairId) => {
            const executiveEmail = localStorage.getItem("username");

            if (!executiveEmail) {
                alert("Guide email not found. Please log in again.");
                return;
            }

            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    alert("Authorization token missing. Please log in.");
                    return;
                }
                console.log("Email sent to backend:", { fairId, executiveEmail }); //prints correct values
                const response = await axios.post(
                    "http://localhost:8081/api/fair/executive-enroll",
                    { fairId, executiveEmail }, //backend gives error sayin executive email null
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.status === 200 || response.status === 201 || response.status === 202) {
                    alert("Enrollment successful!");
                    // Refresh the enrolled fairs and available fairs
                    setToggleState((prev) => !prev);
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    alert("Invalid enrollment request. Please try again.");
                } else if (error.response?.status === 403) {
                    alert("You are not authorized to enroll in this fair.");
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }

            }
        };

    return (
        <div className="fair-schedule-container">
            <h4 className="tour-list-header">Available Fairs</h4>
            <ul className="fair-list">
                {sortedFairs
                    .filter(
                        (fair) =>
                            fair.fairStatus === "Pending" ||
                            fair.fairStatus === "TourGuideAssigned"
                    ) // Filter out only enrollable fairs
                    .map((fair) => {
                        const isUserEnrolled = enrolledFairs.some(
                            (enrolledFair) => enrolledFair.id === fair.id
                        );
                        return (
                            <li
                                key={fair.id}
                                className="tour-item"
                                data-status={fair.fairStatus}
                            >
                                <p>
                                    <strong>Date:</strong> {formatISODate(new Date(fair.startDate))}
                                </p>
                                <p>
                                    <strong>Status:</strong> {fair.fairStatus}
                                </p>
                                <button
                                    onClick={() => handleEnroll(fair.id)}
                                    className="enroll-button"
                                    disabled={isUserEnrolled}
                                >
                                    {isUserEnrolled ? "Enrolled" : "Enroll"}
                                </button>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default AllFairsBTOManager;
