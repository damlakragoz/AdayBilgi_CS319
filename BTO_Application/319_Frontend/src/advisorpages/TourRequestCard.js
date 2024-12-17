import React from "react";
import axios from "axios";

const TourRequestCard = ({ tour, onAction }) => {
  const advisorEmail = localStorage.getItem("username"); // Retrieve advisor's email dynamically
  const token = localStorage.getItem("userToken"); // Retrieve token for Authorization

  const handleAccept = async () => {
    try {
      await axios.put(
        "http://localhost:8081/api/tour/accept-withdraw-request",
        {
          tourId: tour.id,
          advisorEmail: advisorEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      );
      alert("Withdraw request accepted. You are now assigned to this tour.");
      onAction(tour.id, "accept");
    } catch (err) {
      console.error("Error accepting withdraw request:", err.message);
      alert("Failed to accept the withdraw request.");
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        "http://localhost:8081/api/tour/reject-withdraw-request",
        {
          tourId: tour.id,
          advisorEmail: advisorEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      );
      alert("Withdraw request rejected. Tour status updated to 'Withdrawn'.");
      onAction(tour.id, "reject");
    } catch (err) {
      console.error("Error rejecting withdraw request:", err.message);
      alert("Failed to reject the withdraw request.");
    }
  };

  return (
    <div style={styles.card}>
      <h3>Tour ID: {tour.id}</h3>
      <p>
        <strong>Date:</strong> {tour.chosenDate}
      </p>
      <p>
        <strong>Time Slot:</strong> {tour.chosenTimeSlot}
      </p>
      <p>
        <strong>High School:</strong> {tour.applyingHighschoolName}
      </p>
      <div style={styles.actions}>
        <button style={styles.acceptBtn} onClick={handleAccept}>
          Accept
        </button>
        <button style={styles.rejectBtn} onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "5px",
    margin: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "3px",
  },
  rejectBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "3px",
  },
};

export default TourRequestCard;
