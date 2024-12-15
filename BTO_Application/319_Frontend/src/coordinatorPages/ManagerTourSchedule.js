import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";

import "react-calendar/dist/Calendar.css";
import "../tourguidepages/TourSchedule.css";

const timeSlots = [
    { id: "SLOT_9_10", displayName: "09:00-10:00" },
    { id: "SLOT_10_11", displayName: "10:00-11:00" },
    { id: "SLOT_11_12", displayName: "11:00-12:00" },
    { id: "SLOT_13_14", displayName: "13:00-14:00" },
    { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

const ManagerTourSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tours, setTours] = useState([]);
    const [greenDates, setGreenDates] = useState([]);
    const [greyDates, setGreyDates] = useState([]);
    const [yellowDates, setYellowDates] = useState([]);
    const [toggleState, setToggleState] = useState(false); // Initially false

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const formatISODate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
            .toISOString()
            .split("T")[0];
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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
                const allTours = response.data;

                const toursByDate = allTours.reduce((acc, tour) => {
                    const tourDate = formatISODate(new Date(tour.chosenDate));
                    if (!acc[tourDate]) acc[tourDate] = [];
                    acc[tourDate].push(tour);
                    return acc;
                }, {});

                const newGreenDates = [];
                const newGreyDates = [];
                const newYellowDates = [];

                for (const [date, tours] of Object.entries(toursByDate)) {
                    const anyPending = tours.some(
                        (tour) =>
                           tour.tourStatus === "Pending"
                    );
                    const hasCriticalStatus = tours.some(
                        (tour) =>
                            tour.tourStatus === "WithdrawRequested" ||
                            tour.tourStatus === "Approved" ||
                            tour.tourStatus === "Withdrawn"
                    );

                    if (anyPending) {
                        newYellowDates.push(date);
                    } else if (hasCriticalStatus) {
                        newGreenDates.push(date);
                    } else {
                        newGreyDates.push(date);
                    }
                }

                setYellowDates(newYellowDates);
                setGreenDates(newGreenDates);
                setGreyDates(newGreyDates);
                setTours(allTours);
            } else {
                alert("No tours found for the specified date.");
            }
        } catch (error) {
            console.error("Error fetching tours:", error.message);
            alert("Failed to load tours. Please try again later.");
        }
    };

    useEffect(() => {
        fetchTours();
    }, [toggleState]);

    const handleApprove = async (tourId) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const coordinatorEmail = localStorage.getItem("username");
            const response = await axios.put(
                "http://localhost:8081/api/tour/approve",
                { coordinatorEmail, tourId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                alert("Tour approved successfully!");
                setTours((prevTours) =>
                    prevTours.map((tour) =>
                        tour.id === tourId ? { ...tour, tourStatus: "Approved" } : tour
                    )
                );
                // Toggle to trigger the rerender
                setToggleState((prev) => !prev); // Toggle the state
            }
        } catch (error) {
            console.error("Error approving tour:", error.message);
            alert("Failed to approve the tour. Please try again.");
        }
    };

    const filteredTours = tours.filter(
        (tour) =>
            formatISODate(new Date(tour.chosenDate)) === formatISODate(selectedDate)
    );

    const groupedTours = timeSlots.map((slot) => {
        return {
            ...slot,
            tours: filteredTours.filter((tour) => tour.chosenTimeSlot === slot.id),
        };
    });

    return (
        <div className="tour-schedule-container">
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="tr-TR"
                    tileClassName={({ date, view }) => {
                        if (view === "month") {
                            const dateStr = formatISODate(date);

                            if (greenDates.includes(dateStr)) {
                                return "highlight-green";
                            }

                            if (greyDates.includes(dateStr)) {
                                return "highlight-grey";
                            }
                            if (yellowDates.includes(dateStr)) {
                                return "highlight-yellow";
                            }
                        }
                        return null;
                    }}
                />
            </div>

            <div className="tour-list-container">
                <h4 className="tour-list-header">
                    {formatDate(selectedDate)} TARİHİNDEKİ TURLAR
                </h4>

                {groupedTours.map((slot) => (
                    <div key={slot.id} className="time-slot">
                        <h5>{slot.displayName}</h5>
                        {slot.tours.length > 0 ? (
                            <ul>
                                {slot.tours.map((tour) => (
                                    <li
                                        key={tour.id}
                                        style={{
                                            backgroundColor:
                                                tour.tourStatus === "Pending"
                                                    ? "#fff3cd" // Yellow for pending
                                                    : tour.tourStatus === "Approved"
                                                    ? "#d4edda" // Green for approved
                                                    : "#e9ecef", // Default grey
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            padding: "0.5rem",
                                            margin: "0.5rem 0",
                                        }}
                                    >
                                        <strong>Visitor Count:</strong> {tour.visitorCount}
                                        <br />
                                        <strong>Tour Status:</strong> {tour.tourStatus}
                                        <br />
                                        {tour.tourStatus === "Pending" && (
                                            <button
                                                onClick={() => handleApprove(tour.id)}
                                                style={{
                                                    marginTop: "0.5rem",
                                                    padding: "0.4rem 0.8rem",
                                                    border: "none",
                                                    backgroundColor: "#fbbc39", // Orangy color for approve
                                                    color: "white",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Bu zaman diliminde tur bulunmamaktadır.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerTourSchedule;
