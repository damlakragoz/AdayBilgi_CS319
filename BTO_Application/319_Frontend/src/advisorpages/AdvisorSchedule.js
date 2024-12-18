import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./AdvisorSchedule.css";

const timeSlots = [
    { id: "SLOT_9_10", displayName: "09:00-10:00" },
    { id: "SLOT_10_11", displayName: "10:00-11:00" },
    { id: "SLOT_11_12", displayName: "11:00-12:00" },
    { id: "SLOT_13_14", displayName: "13:00-14:00" },
    { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

const TourSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [greenDates, setGreenDates] = useState([]);
    const [greyDates, setGreyDates] = useState([]);
    const [tours, setTours] = useState([]);
    const [enrolledTours, setEnrolledTours] = useState([]);
    const advisorEmail = localStorage.getItem("username");
    const token = localStorage.getItem("userToken");

    const formatISODate = (date) => date.toLocaleDateString("en-CA");

    const handleDateChange = (date) => setSelectedDate(date);

    // Fetch all tours
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/tour/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    const allTours = response.data;
                    const newGreenDates = [];
                    const newGreyDates = [];

                    allTours.forEach((tour) => {
                        const dateStr = formatISODate(new Date(tour.chosenDate));
                        if (tour.tourStatus === "WithdrawRequested") //acceptlenirse withdrawn status rejectlenirse withdraw
                        newGreenDates.push(dateStr);
                        else if (tour.tourStatus === "AdvisorAssigned") newGreyDates.push(dateStr);
                    });

                    setGreenDates(newGreenDates);
                    setGreyDates(newGreyDates);
                    setTours(allTours);
                }
            } catch (error) {
                console.error("Error fetching tours:", error.message);
            }
        };
        fetchTours();
    }, [token]);

    // Fetch advisor-enrolled tours
    useEffect(() => {
        const fetchEnrolledTours = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/tour/advisor-enrolled", {
                    params: { advisorEmail },
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setEnrolledTours(response.data);
                }
            } catch (error) {
                console.error("Error fetching advisor tours:", error.message);
            }
        };
        fetchEnrolledTours();
    }, [advisorEmail, token]);

    const handleEnroll = async (tourId) => {
        try {
            await axios.post(
                "http://localhost:8081/api/tour/assign-advisor",
                { tourId, advisorEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Successfully enrolled in the tour!");
            setEnrolledTours([...enrolledTours, { id: tourId }]);
        } catch (error) {
            console.error("Error enrolling in the tour:", error.message);
        }
    };

    const filteredTours = useMemo(() => {
        return tours.filter((tour) => formatISODate(new Date(tour.chosenDate)) === formatISODate(selectedDate));
    }, [tours, selectedDate]);

    return (
        <div className="tour-schedule-container">
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="tr-TR"
                    tileClassName={({ date }) => {
                        const dateStr = formatISODate(date);
                        if (greenDates.includes(dateStr)) return "highlight-green";
                        if (greyDates.includes(dateStr)) return "highlight-grey";
                        return null;
                    }}
                />
            </div>

            <div className="tour-list-container">
                <h4>{selectedDate.toDateString()} TARİHİNDEKİ TURLAR</h4>
                {filteredTours.length ? (
                    filteredTours.map((tour) => (
                        <div key={tour.id} className="tour-item">
                            <p><strong>Visitor Count:</strong> {tour.visitorCount}</p>
                            <p><strong>Status:</strong> {tour.tourStatus}</p>
                            <button onClick={() => handleEnroll(tour.id)}>Enroll</button>
                        </div>
                    ))
                ) : (
                    <p>No tours available for this date.</p>
                )}
            </div>
        </div>
    );
};

export default TourSchedule;
