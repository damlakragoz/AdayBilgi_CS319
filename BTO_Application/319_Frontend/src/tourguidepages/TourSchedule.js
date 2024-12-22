import React, { useState, useEffect, useMemo } from "react";
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

// Tur durumlarını Türkçe'ye çevirmek için bir eşleme tablosu
const statusTranslations = {
    "Approved": " Onaylandı",
    "Rejected": " Reddedildi",
    "Canceled": " İptal edildi",
    "Withdrawn": " Turdan Çekilindi",
    "WithdrawRequested": " Çekilme Talep Edildi",
    "GuideAssigned": " Rehber Atandı",
    "AdvisorAssigned": " Danışman Atandı",
    "Finished": " Tamamlandı",
};

const TourSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [greenDates, setGreenDates] = useState([]);
    const [greyDates, setGreyDates] = useState([]);
    const [tours, setTours] = useState([]);
    const [enrolledTours, setEnrolledTours] = useState([]);
    const [toggleState, setToggleState] = useState(false); // Initially false

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };


    const formatISODate = (date) => {
        if (typeof date === "string") return date; // If already a string, return it
        return date.toLocaleDateString("en-CA"); // Formats as YYYY-MM-DD
    };

    // Durumu Türkçe'ye çeviren fonksiyon
    const translateStatusToTurkish = (status) => {
        return statusTranslations[status] || status; // Eğer durum bulunamazsa orijinal değeri döndür
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    // Fetch all tours
    useEffect(() => {
        const fetchTours = async () => {
            try {
                console.log("CEM All TOURS")
                const token = localStorage.getItem("userToken");
                if (!token) {
                    alert("Authorization token missing. Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:8081/api/tour/getAll", {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (response.status === 200) {
                    const allTours = response.data;

                    const toursByDate = allTours.reduce((acc, tour) => {
                        const tourDate = formatISODate(new Date(tour.chosenDate)); // Correct date format
                        if (!acc[tourDate]) acc[tourDate] = [];
                        acc[tourDate].push(tour);
                        return acc;
                    }, {});


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
                    setTours(allTours);
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
                console.log(token);
                console.log(guideEmail);
                const response = await axios.get(
                    "http://localhost:8081/api/tourguide/get/enrolledTours", // Note POST method
                    {
                        params: {guideEmail: guideEmail},
                        headers: {
                            Authorization: `Bearer ${token}`, // Add the authorization header
                        },
                        withCredentials: true
                    }
                );

                if (response.status === 200 ) {
                    const normalizedEnrolledTours = response.data.map((tour) => ({
                        ...tour,
                        chosenDate: formatISODate(new Date(tour.chosenDate)), // Correct date format
                    }));

                    setEnrolledTours(normalizedEnrolledTours);
                    console.log("Normalized Enrolled Tours:", normalizedEnrolledTours);
                }
            } catch (error) {
                console.error("Error fetching enrolled tours:", error.message);
            }
        };
        fetchEnrolledTours();
    }, [toggleState]);


    const filteredTours = useMemo(() => {
        return tours.filter((tour) => tour.chosenDate === formatISODate(selectedDate));
    }, [tours, selectedDate]);

    /*
        const filteredTours = useMemo(() => {
            return tours.filter(
                (tour) =>
                    formatISODate(new Date(tour.chosenDate)) === formatISODate(selectedDate)
            );
        }, [tours, selectedDate]);

     */

    const groupedTours = useMemo(() => {
        return timeSlots.map((slot) => ({
            ...slot,
            tours: filteredTours.filter((tour) => tour.chosenTimeSlot === slot.id),
        }));
    }, [filteredTours])

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
                {tourId, applyingGuideEmail},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );

            if (response.status == 200 || response.status == 201) {
                alert("Enrollment successful!");
                // Update the enrolled tours state to include the newly enrolled tour
                setEnrolledTours((prev) => [
                    ...prev,
                    { id: tourId, chosenDate: formatISODate(selectedDate), tourStatus: "GuideAssigned" },
                ]);

                // Optionally, you can update the general `tours` state to reflect changes
                setTours((prev) =>
                    prev.map((tour) =>
                        tour.id === tourId
                            ? { ...tour, tourStatus: "GuideAssigned" }
                            : tour
                    )
                );
                // Toggle to trigger the rerender
                setToggleState((prev) => !prev); // Toggle the state
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
                {tourId, applyingGuideEmail},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200 || response.status == 201) {
                alert("Withdraw request successful!");
                // Update the enrolled tours state to remove the withdrawn tour
                setEnrolledTours((prev) =>
                    prev.map((tour) =>
                        tour.id === tourId
                            ? { ...tour, tourStatus: "WithdrawRequested" }
                            : tour
                    )
                );
                // Optionally, you can update the general `tours` state to reflect changes
                setTours((prev) =>
                    prev.map((tour) =>
                        tour.id === tourId
                            ? { ...tour, tourStatus: "WithdrawRequested" }
                            : tour
                    )
                );
                // Toggle to trigger the rerender
                console.log("ÖNCE")
                setToggleState((prev) => !prev); // Toggle the state
                console.log("SONRA")
            }
        } catch (error) {
            console.error("Error requesting withdrawal:", error.response || error.message);
        }
    };

    return (
        <div className="tgschedule-tour-schedule-container">

            {/* Calendar Section */}
            <div className="tgschedule-calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="tr-TR"
                    tileClassName={({date, view}) => {
                        if (view === "month") {
                            const dateStr = formatISODate(date);
                            if (greenDates.includes(dateStr)) {
                                return "highlight-green"; // Green for critical statuses
                            }
                            if (greyDates.includes(dateStr)) {
                                return "highlight-grey"; // Grey for assigned
                            }
                        }
                        return null;
                    }}

                />
            </div>
            {/* Tour List Section */}
            <div className="tgschedule-tour-list-container">
                <h4 className="tgschedule-tour-list-header">
                    {formatDate(selectedDate)} TARİHİNDEKİ ONAYLANMIŞ TURLAR
                </h4>

                {/* Render all time slots */}
                {groupedTours.map((slot) => (
                    <div key={slot.id} className="time-slot">
                        <h5>{slot.displayName}</h5>
                        {slot.tours.length > 0 ? (
                            <ul>
                                {slot.tours.map((tour) => {
                                    const isUserEnrolled = enrolledTours.some(
                                        (enrolledTour) =>
                                            enrolledTour.id === tour.id &&
                                            enrolledTour.chosenDate === formatISODate(new Date(tour.chosenDate))
                                    );
                                    return (
                                        <li
                                            key={tour.id}
                                            style={{
                                                backgroundColor:
                                                    tour.tourStatus === "Approved" ||
                                                    tour.tourStatus === "Withdrawn" ||
                                                    tour.tourStatus === "WithdrawRequested"
                                                        ? "#d4edda" // Green for specific statuses
                                                        : tour.tourStatus === "GuideAssigned"
                                                            ? "#e9ecef" // Grey for assigned
                                                            : "#f8d7da", // Red for others
                                                border: "1px solid #ccc",
                                                borderRadius: "5px",
                                                padding: "0.5rem",
                                                margin: "0.5rem 0",
                                            }}
                                        >
                                            <strong>Ziyaretçi
                                                Sayısı:</strong> {tour.visitorCount}
                                            <br/>
                                            <strong>Tur Durumu:</strong>
                                                {(tour.tourStatus === "Rejected" && tour.assignedGuideEmail != null )? " İptal Edildi" : translateStatusToTurkish(tour.tourStatus)}
                                            <br/>
                                            <strong>Tur Rehberi E-mail:</strong> {tour.assignedGuideEmail}
                                            <br/>
                                            {/* Request Withdraw or Enroll Button Logic */}
                                            {isUserEnrolled ? (
                                                tour.tourStatus === "GuideAssigned" ? (
                                                    // Show "Request Withdraw" button if the tour is in "GuideAssigned" status
                                                    <button
                                                        onClick={() => handleRequestWithdraw(tour.id)}
                                                        style={{
                                                            marginTop: "0.5rem",
                                                            padding: "0.4rem 0.8rem",
                                                            border: "none",
                                                            backgroundColor: "#dc3545", // Red for withdraw
                                                            color: "white",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Turdan Çekil
                                                    </button>
                                                ) : tour.tourStatus === "WithdrawRequested" ||
                                                tour.tourStatus === "Withdrawn" ||
                                                tour.tourStatus === "Approved" ? (
                                                    // Show "Enroll" button for critical statuses
                                                    <button
                                                        onClick={() => handleEnroll(tour.id)}
                                                        style={{
                                                            marginTop: "0.5rem",
                                                            padding: "0.4rem 0.8rem",
                                                            border: "none",
                                                            backgroundColor: "#28a745", // Green for enroll
                                                            color: "white",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Kaydol
                                                    </button>
                                                ) : null
                                            ) : (
                                                tour.tourStatus === "Approved" ||
                                                tour.tourStatus === "Withdrawn" ||
                                                tour.tourStatus === "WithdrawRequested" ? (
                                                    // Show "Enroll" button for non-enrolled users in critical statuses
                                                    <button
                                                        onClick={() => handleEnroll(tour.id)}
                                                        style={{
                                                            marginTop: "0.5rem",
                                                            padding: "0.4rem 0.8rem",
                                                            border: "none",
                                                            backgroundColor: "#28a745", // Green for enroll
                                                            color: "white",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Kaydol
                                                    </button>
                                                ) : null
                                            )}

                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>Bu zaman diliminde tur bulunmamaktadır.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default TourSchedule;