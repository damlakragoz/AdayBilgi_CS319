import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, getDaysInMonth } from "date-fns";
import { tr } from "date-fns/locale";
import "./PuantageTable.css";

const PuantageTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [users, setUsers] = useState([]); // Dynamically fetched users
  const [activities, setActivities] = useState([]); // Finished activities
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const daysInMonth = getDaysInMonth(selectedMonth);
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  // Fetch users and activities
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all active users
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

      // Fetch finished fairs
      const fairsResponse = await axios.get(
          "http://localhost:8081/api/fair/by-month/finished",
          {
            params: {
              month: selectedMonth.getMonth() + 1,
              year: selectedMonth.getFullYear(),
            },
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      // Filter activities with duration > 0
      const validTours = toursResponse.data.filter((tour) => tour.duration > 0);
      const validFairs = fairsResponse.data.filter((fair) => fair.duration > 0);

      const validUsers = usersResponse.data || [];
      const validUserEmails = validUsers.map((user) => user.email);

      const formattedTours = validTours
          .filter((tour) => validUserEmails.includes(tour.assignedGuideEmail))
          .map((tour) => ({
            id: tour.id,
            userEmail: tour.assignedGuideEmail,
            date: tour.chosenDate,
            hoursWorked: tour.duration,
            type: "Tur",
          }));

      const formattedFairs = validFairs
          .filter((fair) => validUserEmails.includes(fair.assignedGuideEmail))
          .map((fair) => ({
            id: fair.id,
            userEmail: fair.assignedGuideEmail,
            date: fair.startDate,
            hoursWorked: fair.duration,
            type: "Fuar",
          }));

      setUsers(validUsers);
      setActivities([...formattedTours, ...formattedFairs]);
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

  const groupActivitiesByDate = (activities) => {
    return activities.reduce((grouped, activity) => {
      const { date, userEmail, hoursWorked, type } = activity;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][userEmail]) grouped[date][userEmail] = [];

      grouped[date][userEmail].push({ hoursWorked, type });
      return grouped;
    }, {});
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
      <div className="calendar-container">

        {/* Month Selector */}
        <div className="puantage-month-selector">
          <button
              onClick={() =>
                  setSelectedMonth(
                      new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1))
                  )
              }
          >
            Önceki Ay
          </button>
          <span>{format(selectedMonth, "MMMM yyyy", {locale: tr})}</span>
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

        {/* Scrollable Table Wrapper */}
        <div className="puantage-table-wrapper">
          <table className="puantage-calendar-table">
            <thead>
            <tr>
              <th>İsim/Gün</th>
              {Array.from({length: daysInMonth}, (_, i) => (
                  <th key={i + 1}>{i + 1}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {users.length > 0 ? (
                users.map((user) => (
                    <tr key={user.email}>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      {Array.from({length: daysInMonth}, (_, i) => {
                        const day = formatDate(
                            new Date(
                                selectedMonth.getFullYear(),
                                selectedMonth.getMonth(),
                                i + 1
                            )
                        );
                        const userActivities =
                            groupedActivities[day]?.[user.email] || [];

                        return (
                            <td key={i}>
                              {userActivities.length > 0 ? (
                                  <div className="puantage-activity-box">
                                    {userActivities.map((activity, index) => (
                                        <span key={index}>
                            {activity.hoursWorked} saat ({activity.type})
                          </span>
                                    ))}
                                  </div>
                              ) : (
                                  <span>–</span>
                              )}
                            </td>
                        );
                      })}
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={daysInMonth + 1}>No users found.</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default PuantageTable;
