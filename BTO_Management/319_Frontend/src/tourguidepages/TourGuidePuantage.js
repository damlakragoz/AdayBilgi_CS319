import React, { useEffect, useState } from 'react';
import TourGuideNavbar from './TourGuideNavbar';
import './TourGuidePuantage.css';
import PuantageTable from '../common/PuantageTable';
import axios from 'axios';

const TourGuidePuantage = () => {
  const [newActivity, setNewActivity] = useState({
    date: '',
    hoursWorked: '',
  });

  const [activities, setActivities] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [userName, setUserName] = useState(""); // State to hold the logged-in username
  const [userRole, setUserRole] = useState(""); // State to hold the logged-in user's role

  // Fetch the list of tour guides and their total hours worked
  const fetchTourGuides = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        return;
      }

      // Get username and role from localStorage
      const storedUserName = localStorage.getItem('username');
      const storedRole = localStorage.getItem('role');

      if (storedUserName) setUserName(storedUserName);
      if (storedRole) setUserRole(storedRole);

      // Fetch tour guides and their total hours worked from backend
      const response = await axios.get('http://localhost:8081/api/tourguide/getAll', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTourGuides(response.data); // Set the list of tour guides with their total hours worked
      } else {
        alert("Error fetching tour guides data.");
      }
    } catch (error) {
      console.error("Error fetching tour guides:", error);
      alert("Failed to load tour guides. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTourGuides(); // Fetch the initial tour guide data
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hours = parseFloat(newActivity.hoursWorked);
    if (hours <= 0) {
      alert("Please enter a valid number of hours worked (greater than 0).");
      return;
    }
    if (hours % 0.5 !== 0) {
      alert("Please enter hours worked in increments of 0.5 (e.g., 0.5, 1, 1.5, etc.).");
      return;
    }

    if (!userName) {
      alert("User not logged in.");
      return;
    }

    console.log("Submitting data:", {
      userName,       // Log username to check it's correct
      hoursWorked: newActivity.hoursWorked, // Log hoursWorked to verify it's parsed correctly
      date: newActivity.date,
    });

    setActivities(prevActivities => [
      ...prevActivities,
      { user: userName, date: newActivity.date, activity: newActivity.hoursWorked },
    ]);

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        'http://localhost:8081/api/tourguide/updateWorkHours',
        {
          userName: userName,  // Ensure the userName (email) is correct
          hoursWorked: hours,  // Send the parsed number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from backend:", response); // Log the response to check what's returned

      if (response.status === 200) {
        alert("Work hours updated successfully!");
        fetchTourGuides(); // Re-fetch tour guides to update the frontend
      } else {
        alert("Failed to update work hours.");
      }
    } catch (error) {
      console.error("Error updating work hours:", error);
      alert("Error updating work hours. Please try again later.");
    }

    // Reset the form after submission
    setNewActivity({ date: '', hoursWorked: '' });
  };

  return (
    <div className="tourguide-puantage">
      <TourGuideNavbar />
      <PuantageTable activities={activities} users={tourGuides} />

      {/* Activity Submission Form */}
      <div className="activity-form-container">
        <h3>Submit Your Activity</h3>
        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label htmlFor="date">Activity Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newActivity.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hoursWorked">Hours Worked:</label>
            <input
              type="number"
              id="hoursWorked"
              name="hoursWorked"
              value={newActivity.hoursWorked}
              onChange={handleChange}
              min="0.5"
              step="0.5"
              required
            />
          </div>

          <button type="submit">Submit Activity</button>
        </form>
      </div>
    </div>
  );
};

export default TourGuidePuantage;
