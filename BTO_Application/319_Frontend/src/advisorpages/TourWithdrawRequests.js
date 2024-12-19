import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TourWithdrawRequests.css";

// Time slot data
const timeSlots = [
  { id: "SLOT_9_10", displayName: "09:00-10:00" },
  { id: "SLOT_10_11", displayName: "10:00-11:00" },
  { id: "SLOT_11_12", displayName: "11:00-12:00" },
  { id: "SLOT_13_14", displayName: "13:00-14:00" },
  { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

// Function to map time slot ID to display name
const getTimeSlotDisplayName = (slotId) => {
  const slot = timeSlots.find((timeSlot) => timeSlot.id === slotId);
  return slot ? slot.displayName : "Unknown Time Slot";
};

const TourWithdrawRequests = () => {
  const [withdrawnTours, setWithdrawnTours] = useState([]);
  const [guideNames, setGuideNames] = useState({});
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");
  const advisorEmail = localStorage.getItem("username");

  // Fetch WithdrawRequested tours
  useEffect(() => {
    const fetchWithdrawnTours = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/advisor/get/all-assigned-day-tours", {
          params: { advisorEmail: advisorEmail },
          headers: {Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const filteredTours = await Promise.all(
            response.data
              .filter((tour) => tour.tourStatus === "WithdrawRequested")
              .map(async (tour) => {
                // Fetch the assigned guide's email for the tour
                try {
                  const guideResponse = await axios.get(
                    "http://localhost:8081/api/tour/get/assignedGuide",
                    {
                      params: { tourId: tour.id },
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const assignedGuideEmail = guideResponse.data?.email;
                  if (assignedGuideEmail !== advisorEmail) {
                    return tour;
                  }
                } catch (error) {
                  console.error(
                    `Error fetching guide for tour ID ${tour.id}:`,
                    error
                  );
                }
                return null;
              })
          );

          // Filter out null values (tours that were excluded)
          setWithdrawnTours(filteredTours.filter((tour) => tour !== null));
        }
      } catch (err) {
        setError("Failed to load withdraw requests.");
        console.error(err);
      }
    };

    fetchWithdrawnTours();
  }, [token, advisorEmail]);

  // Fetch guide names dynamically for each tour
  const fetchGuideNames = async (tours) => {
    const guideData = {};
    for (const tour of tours) {
      try {
        const response = await axios.get("http://localhost:8081/api/tour/get/assignedGuide", {
          params: { tourId: tour.id },
          headers: { Authorization: `Bearer ${token}` },
        });
        guideData[tour.id] =
          response.data.firstName && response.data.lastName
            ? `${response.data.firstName} ${response.data.lastName}`
            : "No Guide Assigned";
      } catch (error) {
        console.error("Error fetching guide name for tour ID:", tour.id, error);
        guideData[tour.id] = "Error Fetching Guide";
      }
    }
    setGuideNames(guideData);
  };

  const handleAccept = async (tourId) => {
    try {
      await axios.put(
        "http://localhost:8081/api/tour/accept-withdraw-request",
        { tourId, advisorEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdrawnTours((prev) => prev.filter((tour) => tour.id !== tourId));
    } catch (err) {
      console.error(err);
      alert("Failed to accept the withdraw request.");
    }
  };

  const handleReject = async (tourId) => {
    try {
      await axios.put(
        "http://localhost:8081/api/tour/reject-withdraw-request",
        { tourId, advisorEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdrawnTours((prev) => prev.filter((tour) => tour.id !== tourId));
    } catch (err) {
      console.error(err);
      alert("Failed to reject the withdraw request.");
    }
  };


  return (
    <div className="withdraw-container">
      <h1 className="main-title">Tour Withdraw Requests</h1>
      {error && <p className="error">{error}</p>}
      <div className="withdraw-list">
        {withdrawnTours.length > 0 ? (
          withdrawnTours.map((tour) => (
            <div key={tour.id} className="withdraw-card">
              <div className="tour-details">
                <div><strong>Tour ID:</strong> {tour.id}</div>
                <div><strong>Date:</strong> {tour.chosenDate}</div>
                <div>
                  <strong>Time Slot:</strong>{" "}
                  {getTimeSlotDisplayName(tour.chosenTimeSlot)}
                </div>
                <div>
                  <strong>Guide Email:</strong>{" "}
                  {tour.assignedGuideEmail || "Loading..."}
                </div>
              </div>
              <div className="action-buttons">
                <button className="accept-btn" onClick={() => handleAccept(tour.id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(tour.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No withdraw requests available.</p>
        )}
      </div>
    </div>
  );
};

export default TourWithdrawRequests;
