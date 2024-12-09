import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./UserTables.css";

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);
  const [showMinusIcons, setShowMinusIcons] = useState(false);

  // Fetch tour guides
  const fetchTourGuides = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/tourguide/getAll",
        {
          withCredentials: true, // Include credentials like cookies
        }
      );
      setTourGuides(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : "Error fetching data");
      setTourGuides([]); // Clear data on error
    }
  };

  // Fetch tour guides on component load
  useEffect(() => {
    fetchTourGuides();
  }, []);

  // Toggle minus icons visibility
  const toggleMinusIcons = () => {
    setShowMinusIcons((prev) => !prev);
  };

  // Remove a specific row with confirmation
  const removeRow = async (email) => {
      const confirmRemoval = window.confirm(
        `Are you sure you want to remove Tour Guide with email: ${email}?`
      );
      if (confirmRemoval) {
          try {
            const token = localStorage.getItem('userToken');
            const response = await axios.delete(
              "http://localhost:8081/api/tourguide/delete", {
                params: { email: email },
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.status === 204 || response.status === 200) {
              // Remove the deleted Tour Guide from the list
              setTourGuides(tourGuides.filter(tg => tg.email !== email));
              alert("Tour Guide successfully deleted!");
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
      <table className="user-table">
          <thead>
            <tr>
              <th>
                Tour Guides
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={toggleMinusIcons}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    color: "grey",
                  }}
                />
              </th>
              <th>Department</th>
              <th>Puantage</th>
              <th>Work Hours</th>
              <th>Grade</th>
              <th>IBAN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tourGuides.map((tourGuide, index) => (
              <tr key={index}>
                <td>
                  {showMinusIcons && (
                    <span className="tooltip" data-tooltip="Remove Tour Guide">
                      <FontAwesomeIcon
                        icon={faMinus}
                        onClick={() => removeRow(index)}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          color: "grey",
                        }}
                      />
                    </span>
                  )}
                  {tourGuide.username}
                </td>
                <td>{tourGuide.department || "*No Department*"}</td>
                <td>{tourGuide.puantage || "*No Puantage*"}</td>
                <td>{tourGuide.workHours || "*No Work Hours*"}</td>
                <td>{tourGuide.grade || "*No Grade*"}</td>
                <td>{tourGuide.iban || "*No IBAN*"}</td>
                <td>
                  {showMinusIcons && (
                    <span className="tooltip"
                    data-tooltip="Rehber öğretmeni sistemden sil">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => removeRow(tourGuide.email)} // Pass the username directly here
                      style={{
                        cursor: "pointer",
                        marginRight: "10px",
                        color: "grey",
                      }}
                    />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default TourGuideList;
