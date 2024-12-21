import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnayBekleyen.css';

const OnayBekleyenTurlar = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleState, setToggleState] = useState(false); // State to trigger rerender

    const statusMap = {
      "Pending": "Onay bekleniyor",
      Approved: "Onaylandı",
      "Rejected": "Reddedildi",
      Cancelled: "Iptal edildi",
      Finished: "Tamamlandı", // Added Finished state
      default: "yok", // Handle unexpected statuses
    };

    const mapStatusToTurkish = (status) => {
        // Add console log to verify the incoming status
        console.log("Incoming status:", status);

        // Normalize the status to match the keys in the `statusMap`
        const normalizedStatus =
            status && typeof status === "string"
                ? status.trim().replace(/_/g, "-").toLowerCase()
                : "default";

        // Match the normalized status to the map
        const mappedStatus = Object.keys(statusMap).find(
            (key) => key.toLowerCase() === normalizedStatus
        );

        // Return the mapped status or fallback to "default"
        return statusMap[mappedStatus] || statusMap.default;
    };

    // TimeSlot mappings for displaying in a user-friendly format
    const timeSlotDisplayNames = {
        SLOT_9_10:  "09:00-10:00",
        SLOT_10_11: "10:00-11:00",
        SLOT_11_12: "11:00-12:00",
        SLOT_13_14: "13:00-14:00",
        SLOT_14_15: "14:00-15:00",
    };


    // Function to format TimeSlot enum
    const formatTimeSlot = (timeSlot) => {
        return timeSlotDisplayNames[timeSlot] || timeSlot;  // Default to enum value if not found
    };

    // Function to fetch tours
    const fetchTours = async () => {
        try {
            const token = localStorage.getItem('userToken'); // Retrieve the auth token

            if (!token) {
                alert('Authorization token missing. Please log in.');
                return;
            }
            console.log('Retrieved Token:', token);

            const response = await axios.get('http://localhost:8081/api/tour/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log(response.data);

            // Filter tours by tourStatus === 'Pending'
            const pendingTours = response.data.filter((tour) => tour.tourStatus === 'Pending');
            setTours(pendingTours);
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data : 'Error fetching data');
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle tour approval
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
                setToggleState((prev) => !prev);
            }
        } catch (error) {
            console.error("Error approving tour:", error.message);
            alert("Failed to approve the tour. Please try again.");
        }
    };

    // Function to handle tour rejection
    const handleReject = async (tourId) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Authorization token missing. Please log in.");
                return;
            }

            const coordinatorEmail = localStorage.getItem("username");
            const response = await axios.put(
                "http://localhost:8081/api/tour/reject",
                { coordinatorEmail, tourId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201 || response.status === 202) {
                alert("Tour rejected successfully!");
                setTours((prevTours) =>
                    prevTours.map((tour) =>
                        tour.id === tourId ? { ...tour, tourStatus: "Rejected" } : tour
                    )
                );
                // Toggle to trigger the rerender
                setToggleState((prev) => !prev);
            }
        } catch (error) {
            console.error("Error rejecting tour:", error.message);
            alert("Failed to reject the tour. Please try again.");
        }
    };

    // Fetch tours on component load and when toggleState changes
    useEffect(() => {
        fetchTours();
    }, [toggleState]);

    if (loading) {
        return <div className="onay-bekleyen-container">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="onay-bekleyen-container">{error}</div>;
    }


    return (
        <div className="onay-bekleyen-container">
            <h1 className="onay-bekleyen-header">Onay Bekleyen Tur Başvuruları</h1>
            <table className="onay-bekleyen-activity-table">
                <thead>
                    <tr>
                        <th>Tur Onay Durumu</th>
                        <th>Lise</th>
                        <th>Tur Tarihi</th>
                        <th>Saatler</th>
                        <th>Tercihler</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour, index) => (
                        <tr key={index}>
                            <td>{mapStatusToTurkish(tour.status)}</td>
                            <td>{tour.applyingHighschoolName}</td>
                            <td>
                                {new Date(tour.chosenDate).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </td>
                            <td>{formatTimeSlot(tour.chosenTimeSlot)}</td>

                            <td className="onay-bekleyen-buttons">
                                {tour.tourStatus === 'Pending' && (
                                    <>
                                        <button
                                            className="onay-bekleyen-approve-btn"
                                            onClick={() => handleApprove(tour.id)}
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            className="onay-bekleyen-reject-btn"
                                            onClick={() => handleReject(tour.id)}
                                        >
                                            Reddet
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OnayBekleyenTurlar;
