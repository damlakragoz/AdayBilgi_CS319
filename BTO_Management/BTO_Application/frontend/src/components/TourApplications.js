import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './TourApplications.css';

const TourApplications = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    // Fetch data from the Spring Boot backend
    axios
      .get('http://localhost:8080/api/tour-applications')
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tour applications:', error);
      });
    }, []);

  // Handler for adding a new application
  const handleAddApplication = () => {
    console.log('Redirecting to application submission form...');
    navigate('/school-tour-application-form');
  };

  return (
    <div className="tour-applications-container">
      <h1>List of Tour Applications</h1>

      {/* Add Application Button */}
      <button
        className="add-application-button"
        onClick={handleAddApplication}
      >
        + Add Application
      </button>

      <table className="tour-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Destination</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.id}</td>
              <td>{application.name}</td>
              <td>{application.destination}</td>
              <td>{application.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourApplications;
