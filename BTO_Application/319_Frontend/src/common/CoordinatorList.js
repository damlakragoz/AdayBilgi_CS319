import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from React Router
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./UserTables.css";

const CoordinatorList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch coordinators
  const fetchCoordinators = async () => {
    try {
        const token = localStorage.getItem("userToken"); // Retrieve the auth token (adjust as needed)
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8081/api/coordinator/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the authorization header
            },
            withCredentials: true, // Include credentials like cookies
          }
        );
        setCoordinators(response.data);
        setError(null); // Clear errors if successful
    } catch (err) {
        setError(err.response ? err.response.data : "Error fetching data");
        setCoordinators([]); // Clear data on error
    }
  };

  // Fetch coordinators on component load
  useEffect(() => {
    fetchCoordinators();
  }, []);

  // Remove a specific row with confirmation
  const removeCoordinator = async (email) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove coordinator with email: ${email}?`
    );
    if (confirmRemoval) {
        try {
            const token = localStorage.getItem("userToken"); // Retrieve the auth token
            if (!token) {
              alert("Authorization token missing. Please log in.");
              return;
            }

            const response = await axios.delete(
              "http://localhost:8081/api/coordinator/delete",
              {
                params: { username: email },
                headers: {
                  Authorization: `Bearer ${token}`, // Add the authorization header
                },
                withCredentials: true,
              }
            );

            if (response.status === 204 || response.status === 200) {
                // Remove the deleted coordinator from the list
                setCoordinators(coordinators.filter(coordinator => coordinator.email !== email));
                alert("Coordinator successfully deleted!");
            }
        } catch (error) {
          if (error.response) {
            alert(`Error: ${error.response.data}`);
          } else {
            alert('An unexpected error occurred.');
          }
        }
      }
  };

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Telefon Numarası</th>
              <th>Tercihler</th>
            </tr>
          </thead>
          <tbody>
            {coordinators.map((coordinator, index) => (
              <tr key={index}>
                <td>{coordinator.firstName + " " + coordinator.lastName}</td>
                <td>{coordinator.email}</td>
                <td>{coordinator.phoneNumber}</td>
                <td>
                  <button className="usertable-button usertable-button-promote" onClick={() => removeCoordinator(coordinator.email)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

        {/* Centered Button Below the Table */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/koordinator-ekle">
              <button className="usertable-button usertable-button-add">
                Yeni Koordinatör Kaydet
              </button>
            </Link>
          </div>
    </div>
  );
};

export default CoordinatorList;
