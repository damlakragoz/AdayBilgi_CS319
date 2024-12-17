import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, getDaysInMonth } from "date-fns";
import { tr } from "date-fns/locale";
import "./PuantageTable.css";

const PuantageTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [users, setUsers] = useState([]); // Dynamically fetched tour guides
  const [activities, setActivities] = useState([]); // Finished tours
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const daysInMonth = getDaysInMonth(selectedMonth);
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  // Fetch users and activities
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all active tour guides
      const usersResponse = await axios.get(
        "http://localhost:8081/api/tourguide/getAll",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch finished tours
      const toursResponse = await axios.get(
        "http://localhost:8081/api/tour/by-month/finished",
        {
          params: {
            month: selectedMonth.getMonth() + 1,
            year: selectedMonth.getFullYear(),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter tours with duration > 0
      const finishedTours = toursResponse.data.filter(
        (tour) => tour.duration > 0
      );

      const validUsers = usersResponse.data || []; // Ensure no null users
      const validUserEmails = validUsers.map((user) => user.email);

      // Filter activities to exclude tours with invalid users
      const validActivities = finishedTours.filter((tour) =>
        validUserEmails.includes(tour.assignedGuideEmail)
      );

      setUsers(validUsers);
      setActivities(
        validActivities.map((tour) => ({
          id: tour.id,
          userEmail: tour.assignedGuideEmail,
          date: tour.chosenDate,
          hoursWorked: tour.duration,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount or month change
  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  // Group activities by date and user email
  const groupActivitiesByDate = (activities) => {
    return activities.reduce((grouped, activity) => {
      const { date, userEmail, hoursWorked } = activity;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][userEmail]) grouped[date][userEmail] = 0;

      grouped[date][userEmail] += hoursWorked;
      return grouped;
    }, {});
  };

  const groupedActivities = groupActivitiesByDate(activities);

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

      {/* Loading Indicator */}
      {loading ? (
        <p>Loading...</p>
      ) : (
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
              {users.length > 0 ? (
                users.map((user) => {
                  const userEmail = user.email;

                  return (
                    <tr key={userEmail}>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = formatDate(
                          new Date(
                            selectedMonth.getFullYear(),
                            selectedMonth.getMonth(),
                            i + 1
                          )
                        );
                        const userHours =
                          groupedActivities[day]?.[userEmail] || 0;

                        return (
                          <td key={i}>
                            {userHours > 0 ? (
                              <div className="activity-box">
                                <span>{userHours} saat</span>
                              </div>
                            ) : (
                              <span>–</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={daysInMonth + 1}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PuantageTable;
