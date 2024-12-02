import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMinus } from "@fortawesome/free-solid-svg-icons"; // Import icons
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
  const removeRow = (index) => {
    const confirmRemoval = window.confirm(
      "Are you sure you want to remove this row?"
    );
    if (confirmRemoval) {
      const updatedTourGuides = [...tourGuides];
      updatedTourGuides.splice(index, 1);
      setTourGuides(updatedTourGuides);
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
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default TourGuideList;
