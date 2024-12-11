import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";

import "react-calendar/dist/Calendar.css";
import "./TourSchedule.css";

const timeSlots = [
    { id: "SLOT_9_10", displayName: "09:00-10:00" },
    { id: "SLOT_10_11", displayName: "10:00-11:00" },
    { id: "SLOT_11_12", displayName: "11:00-12:00" },
    { id: "SLOT_13_14", displayName: "13:00-14:00" },
    { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

const TourSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tours, setTours] = useState([]);
    const [greenDates, setGreenDates] = useState([]);
    const [greyDates, setGreyDates] = useState([]);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    // Normalize date to ignore time zones and return only the date part
    const formatISODate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
            .toISOString()
            .split("T")[0];
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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
                    const allTours = response.data;

                    // Group all tours by their date
                    const toursByDate = allTours.reduce((acc, tour) => {
                        const tourDate = formatISODate(new Date(tour.chosenDate));
                        if (!acc[tourDate]) acc[tourDate] = [];
                        acc[tourDate].push(tour);
                        return acc;
                    }, {});

                    // Determine green and grey dates
                    const newGreenDates = [];
                    const newGreyDates = [];

                    for (const [date, tours] of Object.entries(toursByDate)) {
                        const allAssigned = tours.every(
                            (tour) =>
                                tour.tourStatus === "GuideAssigned" ||
                                tour.tourStatus === "AdvisorAssigned"
                        );

                        const hasCriticalStatus = tours.some(
                            (tour) =>
                                tour.tourStatus === "WithdrawRequested" ||
                                tour.tourStatus === "Approved" ||
                                tour.tourStatus === "Withdrawn"
                        );

                        if (hasCriticalStatus) {
                            newGreenDates.push(date);
                        } else if (allAssigned) {
                            newGreyDates.push(date);
                        }
                    }

                    setGreenDates(newGreenDates);
                    setGreyDates(newGreyDates);
                    setTours(allTours); // Maintain the list of tours for selected date filtering
                } else {
                    alert("No tours found for the specified date.");
                }
            } catch (error) {
                console.error("Error fetching tours:", error.message);
                alert("Failed to load tours. Please try again later.");
            }
        };

        fetchTours();
    }, []);

    // Filter tours by selected date and group by time slots
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
            {/* Calendar Section */}
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="tr-TR"
                    tileClassName={({ date, view }) => {
                        if (view === "month") {
                            const dateStr = formatISODate(date); // Normalize the date to YYYY-MM-DD

                            if (greenDates.includes(dateStr)) {
                                return "highlight-green"; // Green for critical statuses
                            }

                            if (greyDates.includes(dateStr)) {
                                return "highlight-grey"; // Grey for all assigned
                            }
                        }
                        return null; // No highlight
                    }}
                />
            </div>

            {/* Tour List Section */}
            <div className="tour-list-container">
                <h4 className="tour-list-header">
                    {formatDate(selectedDate)} TARİHİNDEKİ ONAYLANMIŞ TURLAR
                </h4>

                {/* Render all time slots */}
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
                                                tour.tourStatus === "Approved" ||
                                                tour.tourStatus === "Withdrawn" ||
                                                tour.tourStatus === "WithdrawRequested"
                                                    ? "#d4edda" // Green for critical statuses
                                                    : tour.tourStatus === "GuideAssigned" ||
                                                    tour.tourStatus === "AdvisorAssigned"
                                                        ? "#e9ecef" // Grey for assigned
                                                        : "#f8d7da", // Red for others
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            padding: "0.5rem",
                                            margin: "0.5rem 0",
                                        }}
                                    >
                                        <strong>Visitor Count:</strong> {tour.visitorCount}
                                        <br />
                                        <strong>Tour Status:</strong> {tour.tourStatus}
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

export default TourSchedule;
