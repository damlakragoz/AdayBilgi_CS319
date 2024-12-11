import React from "react";
import { format, getDaysInMonth } from "date-fns";
import "./PuantageTable.css"; // Add custom styles

const PuantageTable = ({ activities, users }) => {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date()); // Current month

  const daysInMonth = getDaysInMonth(selectedMonth); // Get total days in the month
  const formatDate = (date) => format(date, "yyyy-MM-dd"); // Format date to compare

  return (
    <div className="calendar-container">
      {/* Month Selector */}
      <div className="month-selector">
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))} >
          Previous
        </button>
        <span>{format(selectedMonth, "MMMM yyyy")}</span>
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))} >
          Next
        </button>
      </div>

      {/* Calendar Table */}
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
            <tr key={user}>
              <td>{user}</td>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = formatDate(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1));
                const userActivities = activities.filter(
                  (activity) => activity.user === user && activity.date === day
                );

                return (
                  <td key={i}>
                    {userActivities.length > 0 ? (
                      userActivities.map((userActivity, idx) => (
                        <div className="activity-cell" key={idx}>
                          <span>{userActivity.activity}</span>
                          <div className="tooltip">
                            {`${user} - ${userActivity.activityType} Aktivitesi`}
                            <br />
                            {`Giriş Zamanı: ${userActivity.date}`}
                          </div>
                        </div>
                      ))
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PuantageTable;
