import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tour guides
  const fetchTourGuides = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/tourguides/getAll', {
        withCredentials: true, // Include credentials like cookies
      });
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

  return (
    <div>
      <h1>Tour Guides in System</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <ul>
          {tourGuides.map((tourGuide, index) => {
            console.log(tourGuide);
            return (
              <li key={index}>
                {tourGuide.username}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TourGuideList;
