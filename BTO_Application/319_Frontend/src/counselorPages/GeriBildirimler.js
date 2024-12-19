import React, { useState, useEffect } from "react";
import FeedbackForm from "./FeedbackForm";
import "./GeriBildirimler.css";
import axios from "axios";

const GeriBildirimler = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [selectedTourId, setSelectedTourId] = useState(null); // State for the selected tour ID
    const [tours, setTours] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [counselor, setCounselor] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const timeSlotDisplayNames = {
        SLOT_9_10: "09:00-10:00",
        SLOT_10_11: "10:00-11:00",
        SLOT_11_12: "11:00-12:00",
        SLOT_13_14: "13:00-14:00",
        SLOT_14_15: "14:00-15:00",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCounselorInformation();
                await fetchFeedbacks(); // Fetch feedbacks after getting counselor info
                console.log(feedbacks);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch tours only after the counselor state is updated
        if (counselor?.schoolName) {
            fetchTours();
        }
    }, [counselor]); // Dependency on counselor to trigger when it updates


    const fetchCounselorInformation = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const resp = await axios.get("http://localhost:8081/api/counselors/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log("Counselors fetched:", resp.data);

            const counselorEmail = localStorage.getItem("username")?.toLowerCase();
            if (!counselorEmail) {
                console.log("Counselor email is missing.");

            }

            if (!Array.isArray(resp.data)) {
                console.log("Expected response data to be an array, but got:", typeof resp.data);

            }

            const filteredCounselors = resp.data.filter(
                (counselor) => counselor.email?.toLowerCase() === counselorEmail
            );

            if (filteredCounselors.length > 0) {
                setCounselor(filteredCounselors[0]); // Assuming you want the first match
            } else {
                console.warn("No counselor found with the provided email.");
                setCounselor(null);
            }
        } catch (error) {
            console.error("Error fetching counselors:", error);
        }
    };

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }
            console.log(counselor)

            const response = await axios.get("http://localhost:8081/api/tour/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            // filter tours based on the school of counselor
            let filteredTours = response.data.filter(
                (tour) => tour.applyingHighschoolName === counselor.schoolName
            );
            filteredTours = filteredTours.filter(
                (tour) => tour.tourStatus == "Finished" || tour.tourStatus == "Approved"
            );

            console.log(filteredTours);

            const sortedTours = filteredTours.sort((a, b) => {
                const dateA = new Date(a.assignedDate);
                const dateB = new Date(b.assignedDate);
                return dateB - dateA; // Descending order
            });

            setTours(sortedTours);
        } catch (error) {
            console.error("Error fetching tours:", error);
            alert("Failed to fetch tours. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }
            const response = await axios.get("http://localhost:8081/api/feedback/getAll", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log(response.data);
            setFeedbacks(response.data);
        } catch (error) {
            console.log("Error fetching feedbacks:"+error);
        }
    };

    const hasFeedbackForTour = (tourId) => {
        return feedbacks.some((feedback) => (feedback.tour).id == tourId);
    };

    const getRatingForTour = (tourId) => {
        const feedback = feedbacks.find((feedback) => feedback.tour.id === tourId);
        return feedback ? feedback.rating : 0; // Return 0 if no feedback is found
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("tr-TR");
    };

    const formatTimeSlot = (timeSlot) => {
        return timeSlotDisplayNames[timeSlot] || timeSlot;
    };

    const handlePenClick = (tourId) => {
        setSelectedTourId(tourId); // Set the selected tour ID
        setShowFeedbackForm(true); // Show the feedback form
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (showFeedbackForm) {
        return (
            <FeedbackForm
                closeFeedback={() => setShowFeedbackForm(false)}
                tourId={selectedTourId} // Pass the selected tour ID to the FeedbackForm
            />
        );
    }

    return (
        <div>
            <h2>Geri Bildirimlerim</h2>
            <table className="fb-activity-table">
                <thead>
                    <tr>
                        <th>Tur Durumu</th>
                        <th>Geri Bildirim</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Oy</th>
                        <th>Düzenle</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour) => (
                        <tr key={tour.id}>
                            <td>{tour.tourStatus}</td>
                            <td>
                                {hasFeedbackForTour(tour.id)
                                    ? "Geri bildirim verildi"
                                    : "Geri bildirim bekleniyor"}
                            </td>
                            <td>{formatDate(tour.chosenDate)}</td>
                            <td>{formatTimeSlot(tour.chosenTimeSlot)}</td>
                            <td>
                                    {[...Array(5)].map((_, i) => {
                                        const rating = getRatingForTour(tour.id); // Get the tour rating
                                        if (i < Math.floor(rating)) {
                                            return <i key={i} className="fas fa-star text-warning"></i>; // Full star
                                        } else {
                                            return <i key={i} className="fas fa-star text-secondary"></i>; // Empty star
                                        }
                                    })}
                            </td>
                            <td >
                                 {!hasFeedbackForTour(tour.id) &&
                                    tour.tourStatus=="Finished" && (
                                        <i
                                            className="fas fa-pen text-primary"
                                            onClick={() => handlePenClick(tour.id)} // Pass the tour ID
                                            style={{
                                                color: "#2c7a7b",
                                                cursor: "pointer",
                                            }}
                                        ></i>
                                    )}
                                 {!hasFeedbackForTour(tour.id) && (
                                         <button
                                             onClick={() => viewDetails(tour.id)} // Function to handle viewing details
                                              style={{
                                                         padding: "0px 5px",
                                                         border: "1px solid #ddd",
                                                         background: "#f4f4f4",
                                                         cursor: "pointer",

                                                         margin: "0px 20px"
                                                     }}
                                         >
                                             View Details
                                         </button>
                                     )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GeriBildirimler;
