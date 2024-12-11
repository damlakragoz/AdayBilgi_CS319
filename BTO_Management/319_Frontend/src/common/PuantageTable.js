import React, { useState, useEffect } from "react";
import { format, getDaysInMonth } from "date-fns";
import "./PuantageTable.css"; // Add custom styles

const PuantageTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Current month
  const [activities, setActivities] = useState([]); // Activity data

  // Sample user data and activities
  const users = ["Emine Noor", "Eray İşçi", "Yiğit Özhan", "Damla Kara", "İbrahim Çaycı"];
  const sampleActivities = [
    { user: "Emine Noor", date: "2024-10-01", activity: "1.5" },
    { user: "Eray İşçi", date: "2024-10-03", activity: "3" },
    { user: "Yiğit Özhan", date: "2024-10-02", activity: "2" },
    { user: "Yiğit Özhan", date: "2024-10-09", activity: "2" },
  ];

  useEffect(() => {
    // Simulate fetching activity data
    setActivities(sampleActivities);
  }, [selectedMonth]);

  // Get days of the selected month
  const daysInMonth = getDaysInMonth(selectedMonth);

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  // Render calendar
  return (
    <div className="calendar-container">
      {/* Month Selector */}
      <div className="month-selector">
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}>
          Previous
        </button>
        <span>{format(selectedMonth, "MMMM yyyy")}</span>
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}>
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
                const userActivity = activities.find(
                  (activity) => activity.user === user && activity.date === day
                );

                return (
                  <td key={i}>
                    {userActivity ? (
                      <div className="activity-cell">
                        <span>{userActivity.activity}</span>
                        <div className="tooltip">
                          {`Tur Aktivitesi - Giriş Zamanı: ${userActivity.date}`}
                        </div>
                      </div>
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
