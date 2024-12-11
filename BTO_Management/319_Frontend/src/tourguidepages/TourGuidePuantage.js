import React, { useState, useEffect } from 'react';
import TourGuideNavbar from './TourGuideNavbar';
import './TourGuidePuantage.css'; // Make sure to import the styles if you have custom ones.
import PuantageTable from '../common/PuantageTable';

const TourGuidePuantage = () => {
  const [newActivity, setNewActivity] = useState({
    date: '',
    activityType: 'Tour', // Default value is 'Tour'
    hoursWorked: '',
  });

  const [activities, setActivities] = useState([
    { user: "Damla Kara", date: "2024-10-05", activity: "3", time: "10:00", activityType: "Tour" },
    // Other sample activities for Damla Kara or existing users can be added here
  ]);

  const [users, setUsers] = useState([
    "Damla Kara", "Eray İşçi", "Yiğit Özhan", "İbrahim Çaycı"
    // Yuyu Yokonova is not initially added to the users list
  ]);

  // useEffect to log activities and check when they change
  useEffect(() => {
    console.log("Activities updated:", activities);
  }, [activities]); // Log every time activities change

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Replace comma with dot for decimal separator
    const formattedValue = value.replace(',', '.');

    setNewActivity((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure hoursWorked is a valid number greater than 0 and in increments of 0.5
    const hours = parseFloat(newActivity.hoursWorked);
    if (hours <= 0) {
      alert("Please enter a valid number of hours worked (greater than 0).");
      return;
    }
    if (hours % 0.5 !== 0) {
      alert("Please enter hours worked in increments of 0.5 (e.g., 0.5, 1, 1.5, etc.).");
      return;
    }

    const formattedDate = new Date(newActivity.date);
    const time = new Date(formattedDate.setHours(0, 0, 0, 0)).toISOString(); // Assign a time for the activity.

    const userName = "Yuyu Yokonova"; // The user you want to check

    // Add Yuyu Yokonova to the users list only if they submit an activity
    if (!users.includes(userName)) {
      setUsers((prevUsers) => [...prevUsers, userName]);
    }

    // Add the new activity to the activities list
    setActivities(prevActivities => [
      ...prevActivities,
      { user: userName, date: newActivity.date, activity: newActivity.hoursWorked, time, activityType: newActivity.activityType },
    ]);

    // Reset the form
    setNewActivity({ date: '', activityType: 'Tour', hoursWorked: '' });
  };

  return (
    <div className="tourguide-puantage">
      <TourGuideNavbar />
      <PuantageTable activities={activities} users={users} />

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
            <label htmlFor="activityType">Activity Type:</label>
            <select
              id="activityType"
              name="activityType"
              value={newActivity.activityType}
              onChange={handleChange}
              required
            >
              <option value="Tour">Tour</option>
              <option value="Fair">Fair</option>
            </select>
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
