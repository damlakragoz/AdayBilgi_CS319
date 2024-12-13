import React from "react";
import { format, getDaysInMonth } from "date-fns";
import { tr } from "date-fns/locale"; // Import Turkish locale
import "./PuantageTable.css"; // Add custom styles

const PuantageTable = ({ activities, users }) => {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date()); // Current month

  const daysInMonth = getDaysInMonth(selectedMonth); // Get total days in the month
  const formatDate = (date) => format(date, "yyyy-MM-dd"); // Format date to compare

  // Function to group activities by type (Fair or Tour) and sum hours
  const groupActivitiesByType = (activities) => {
    return activities.reduce((grouped, activity) => {
      const date = activity.date;
      const type = activity.activityType;

      if (!grouped[date]) grouped[date] = { tour: [], fair: [] };

      grouped[date][type.toLowerCase()].push(activity);
      return grouped;
    }, {});
  };

  const groupedActivities = groupActivitiesByType(activities);

  return (
    <div className="calendar-container">
      {/* Month Selector */}
      <div className="month-selector">
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))} >
          Önceki Ay
        </button>
        <span>{format(selectedMonth, "MMMM yyyy", { locale: tr })}</span>
        <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))} >
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
              <tr key={user}>
                <td>{user}</td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = formatDate(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1));
                  const userActivities = activities.filter(
                    (activity) => activity.user === user && activity.date === day
                  );

                  // Group the activities by Fair and Tour
                  const fairActivities = userActivities.filter((activity) => activity.activityType === 'Fair');
                  const tourActivities = userActivities.filter((activity) => activity.activityType === 'Tour');

                  const totalFairHours = fairActivities.reduce((acc, curr) => acc + parseFloat(curr.activity), 0);
                  const totalTourHours = tourActivities.reduce((acc, curr) => acc + parseFloat(curr.activity), 0);

                  return (
                    <td key={i}>
                      <div>
                        {/* Fair Activity Total */}
                        {fairActivities.length > 0 && (
                          <div className="activity-box fair">
                            <span>{totalFairHours} </span>
                            <div className="tooltip">
                              {fairActivities.map((activity, idx) => (
                                <div key={idx}>
                                  {activity.activity} saat - {activity.date} ({activity.activityType})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Tour Activity Total */}
                        {tourActivities.length > 0 && (
                          <div className="activity-box tour">
                            <span>{totalTourHours}</span>
                            <div className="tooltip">
                              {tourActivities.map((activity, idx) => (
                                <div key={idx}>
                                  {activity.activity} saat - {activity.date} ({activity.activityType})
                                </div>
                              ))}
                            </div>
                          </div>
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
