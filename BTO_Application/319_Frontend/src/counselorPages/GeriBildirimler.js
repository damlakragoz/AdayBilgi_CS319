import React, { useState, useEffect } from "react";
import FeedbackForm from "./FeedbackForm";
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
                await fetchCounselorInformation(); // Wait for counselor info
            } catch (error) {
                console.error("Error fetching counselor info:", error);
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
//            if (!counselorEmail) {
//                console.log("Counselor email is missing.");
//
//            }

//            if (!Array.isArray(resp.data)) {
//                console.log("Expected response data to be an array, but got:", typeof resp.data);
//
//            }

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
                (tour) => tour.tourStatus != "Rejected" && tour.tourStatus != "Cancelled"
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

            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const hasFeedbackForTour = (tourId) => {
        return feedbacks.some((feedback) => feedback.tourId === tourId);
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
            <table className="table">
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
                                    ? "Geri dönüş verildi"
                                    : "Geri dönüşünüz bekleniyor"}
                            </td>
                            <td>{formatDate(tour.chosenDate)}</td>
                            <td>{formatTimeSlot(tour.chosenTimeSlot)}</td>
                            <td>
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fas fa-star ${
                                            i < tour.stars ? "text-warning" : "text-secondary"
                                        }`}
                                    ></i>
                                ))}
                            </td>
                            <td>
                                <i
                                    className="fas fa-pen text-primary"
                                    onClick={() => handlePenClick(tour.id)} // Pass the tour ID
                                    style={{
                                        color: '#2c7a7b',
                                        cursor: 'pointer',
                                      }}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GeriBildirimler;
