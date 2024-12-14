import React from "react";
import { format, getDaysInMonth } from "date-fns";
import { tr } from "date-fns/locale"; // Import Turkish locale
import "./PuantageTable.css"; // Add custom styles

const PuantageTable = ({ activities, users }) => {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date()); // Current month

  const daysInMonth = getDaysInMonth(selectedMonth); // Get total days in the month
  const formatDate = (date) => format(date, "yyyy-MM-dd"); // Format date to compare

  // Function to group activities by date and sum hours worked
  const groupActivitiesByDate = (activities) => {
    return activities.reduce((grouped, activity) => {
      const date = activity.date;
      const hoursWorked = parseFloat(activity.activity); // Assume activity contains hours worked

      if (!grouped[date]) grouped[date] = {};

      // Aggregate total hours worked per user per date
      if (!grouped[date][activity.user]) {
        grouped[date][activity.user] = 0;
      }
      grouped[date][activity.user] += hoursWorked;

      return grouped;
    }, {});
  };

  const groupedActivities = groupActivitiesByDate(activities); // Group the activities by date

  return (
    <div className="calendar-container">
      {/* Month Selector */}
      <div className="month-selector">
        <button
          onClick={() =>
            setSelectedMonth(
              new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1))
            )
          }
        >
          Önceki Ay
        </button>
        <span>{format(selectedMonth, "MMMM yyyy", { locale: tr })}</span>
        <button
          onClick={() =>
            setSelectedMonth(
              new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1))
            )
          }
        >
          Sonraki Ay
        </button>
      </div>

      {/* Table Wrapper with Horizontal Scroll */}
      <div className="table-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>İsim/Gün</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i + 1}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}> {/* Ensure user has an 'id' */}
                <td>{user.firstName} {user.lastName}</td> {/* Display full name */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = formatDate(
                    new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1)
                  );
                  const userActivities = groupedActivities[day]
                    ? groupedActivities[day][user.id] || 0 // Assuming user.id is unique
                    : 0; // Get total hours worked for this day and user

                  return (
                    <td key={i}>
                      <div>
                        {/* Display the total hours worked for the day */}
                        {userActivities > 0 ? (
                          <div className="activity-box">
                            <span>{userActivities} saat</span>
                            <div className="tooltip">
                              {/* Add more details about the activity if needed */}
                              {activities
                                .filter(
                                  (activity) =>
                                    activity.user === user.id && activity.date === day
                                )
                                .map((activity, idx) => (
                                  <div key={idx}>
                                    {activity.activity} saat - {activity.date}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <span>–</span> // No activity for this day
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PuantageTable;
