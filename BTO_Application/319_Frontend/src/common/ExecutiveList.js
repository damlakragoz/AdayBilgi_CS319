import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"; // Import Link from React Router
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./UserTables.css";

const ExecutiveList = () => {
  const [executives, setExecutives] = useState([]);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role"); //

  // Function to fetch executives
  const fetchExecutives = async () => {
    try {
        const token = localStorage.getItem("userToken"); // Retrieve the auth token (adjust as needed)
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8081/api/executive/getAll", // Updated endpoint for executives
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the authorization header
            },
            withCredentials: true, // Include credentials like cookies
          }
        );
        setExecutives(response.data);
        setError(null); // Clear errors if successful
    } catch (err) {
        setError(err.response ? err.response.data : "Error fetching data");
        setExecutives([]); // Clear data on error
    }
  };

  // Fetch executives on component load
  useEffect(() => {
    fetchExecutives();
  }, []);

  // Remove a specific row with confirmation
  const removeExecutive = async (email) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove executive with email: ${email}?`
    );
    if (confirmRemoval) {
        try {
            const token = localStorage.getItem("userToken"); // Retrieve the auth token
            if (!token) {
              alert("Authorization token missing. Please log in.");
              return;
            }

            const response = await axios.delete(
              "http://localhost:8081/api/executive/delete", // Updated endpoint for deleting executives
              {
                params: { username: email },
                headers: {
                  Authorization: `Bearer ${token}`, // Add the authorization header
                },
                withCredentials: true,
              }
            );

            if (response.status === 204 || response.status === 200) {
                // Remove the deleted executive from the list
                setExecutives(executives.filter(executive => executive.email !== email));
                alert("Executive successfully deleted!");
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
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {executives.map((executive, index) => (
              <tr key={index}>
                <td>{executive.firstName + " " + executive.lastName}</td>
                <td>{executive.email}</td>
                <td>{executive.phoneNumber}</td>
                <td>
                  <button
                    className="usertable-button usertable-button-delete"
                    onClick={() => removeExecutive(executive.email)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        {/* Centered Button Below the Table */}
        { (role==="Admin") &&
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/yonetici-ekle">
              <button className="usertable-button usertable-button-add">
                Yeni Yönetici Kaydet
              </button>
            </Link>
          </div>
        }
    </div>
  );
};

export default ExecutiveList;
