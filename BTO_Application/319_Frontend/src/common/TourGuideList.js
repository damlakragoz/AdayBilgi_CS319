import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./UserTables.css";

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fetchTourGuides = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8081/api/tourguide/getAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setTourGuides(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : "Error fetching data");
      setTourGuides([]);
    }
  };

  useEffect(() => {
    fetchTourGuides();
  }, []);

  const removeRow = async (email) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove Tour Guide with email: ${email}?`
    );
    if (confirmRemoval) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.delete(
          "http://localhost:8081/api/tourguide/delete",
          {
            params: { username: email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 204 || response.status === 200) {
          setTourGuides(tourGuides.filter((tg) => tg.email !== email));
          alert("Tour Guide successfully deleted!");
        }
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data}`);
        } else {
          alert("An unexpected error occurred.");
        }
      }
    }
  };

  const promoteToExpert = async (email) => {
    const confirmPromotion = window.confirm(
      `Are you sure you want to promote the Tour Guide with email: ${email} to an Expert?`
    );

    if (confirmPromotion) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }
        console.log(token);
        const assignedDay = "Monday";
        const response = await axios.post(
          "http://localhost:8081/api/promoteTourGuide",
          null, // No JSON body
          {
            params: {
                guideEmail: email,
                assignedDay: assignedDay,
            },
            headers: { Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",},
            withCredentials: true,
          }
        );

        if (response.status == 200 || response.status === 201 || response.status === 202) {
          alert("Tour Rehberi " + email + " uzmanlığa yükseltildi!");
          fetchTourGuides(); // Refresh the list
        }
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data}`);
        } else {
          alert("An unexpected error occurred.");
        }
      }
    }
  };


  return (
    <div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Bölümü</th>
            <th>Puantaj</th>
            <th>Çalışma Saatleri</th>
            <th>Sınıf</th>
            <th>IBAN</th>
            <th>Uzmanlık</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tourGuides.map((tourGuide, index) => (
            <tr key={index}>
              <td>{tourGuide.firstName +" "+ tourGuide.lastName}</td>
              <td>{tourGuide.email}</td>
              <td>{tourGuide.department}</td>
              <td>{tourGuide.puantage}</td>
              <td>{tourGuide.workHours}</td>
              <td>{tourGuide.grade}</td>
              <td>{tourGuide.iban}</td>
              <td>{tourGuide.role=="TourGuide" ? "Tur Rehberi" : "Advisor"}</td>
              <td>
                {/* Delete Button */}
                <button
                  onClick={() => removeRow(tourGuide.email)}
                  className="usertable-button usertable-button-delete"
                >
                  🗑️
                </button>
                <button
                  onClick={() => promoteToExpert(tourGuide.email)}
                  title="Uzmanlığa Yükselt"
                  className="usertable-button usertable-button-promote"
                >
                  Uzmanlığa Yükselt
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Centered Button Below the Table */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/add-tourguide">
            <button className="usertable-button usertable-button-add">
              Yeni Tur Rehberi Kaydet
            </button>
        </Link>
      </div>
    </div>
  );
};

export default TourGuideList;
