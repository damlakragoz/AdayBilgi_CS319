import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserTables.css';

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tour guides
  const fetchTourGuides = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/tourguide/getAll', {
        withCredentials: true, // Include credentials like cookies
      });
      console.log(response);
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
      <table className="user-table ">
        <thead>
          <tr>
            <th>Tour Guides</th>
          </tr>
        </thead>
        <tbody>
          {tourGuides.map((tourGuide, index) => (
            <tr key={index}>
              <td>{tourGuide.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourGuideList;
