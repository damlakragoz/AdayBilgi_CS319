import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import { Link } from "react-router-dom"; // Import Link from React Router
import "./UserTables.css";

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [currentGuide, setCurrentGuide] = useState(null);

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
      setError(err.response ? err.response.data : "Bilgilere erişilemedi");
      setTourGuides([]);
    }
  };

  useEffect(() => {
    fetchTourGuides();
  }, []);

  const removeRow = async (firstName, lastName, email) => {
    const confirmRemoval = window.confirm(
      `${firstName} ${lastName} isimli tur rehberini silmek istediğinizden emin misiniz?`
    );
    if (confirmRemoval) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Lütfen tekrar giriş yapın.");
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
          alert("Tur rehberi başarıyla silindi!");
        }
      } catch (error) {
        if (error.response) {
          alert(`Hata: ${error.response.data}`);
        } else {
          alert("Beklenmedik bir hata oluştu.");
        }
      }
    }
  };

  const handlePromoteButtonClick = (guide) => {
    setCurrentGuide(guide);
    setIsPopupOpen(true); // Open the popup
  };

  const promoteToExpert = async () => {
    if (!selectedDay) {
      alert("Lütfen bir gün seçin.");
      return;
    }

    const { firstName, lastName, email } = currentGuide;

    const confirmPromotion = window.confirm(
        `${firstName} ${lastName} isimli tur rehberini danışmanlığa yükseltmeyi onaylıyor musunuz?`
    );

    if (confirmPromotion) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.post(
          "http://localhost:8081/api/promoteTourGuide",
          null, // No JSON body
          {
            params: {
              guideEmail: email,
              assignedDay: selectedDay,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if ([200, 201, 202].includes(response.status)) {
          alert(`${firstName} ${lastName} danışmanlığa yükseltildi!`);
          setIsPopupOpen(false); // Close the popup
          fetchTourGuides(); // Refresh the list
        }
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data}`);
        } else {
          alert("Beklenmedik bir hata oluştu.");
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
            <th>E-mail</th>
            <th>Bölüm</th>
            <th>Çalışma Saatleri</th>
            <th>Sınıf</th>
            <th>IBAN</th>
            <th>Görev</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {tourGuides.map((tourGuide, index) => (
            <tr key={index}>
              <td>{tourGuide.firstName +" "+ tourGuide.lastName}</td>
              <td>{tourGuide.email}</td>
              <td>{tourGuide.department}</td>
              <td>{tourGuide.workHours}</td>
              <td>{tourGuide.grade}</td>
              <td>{tourGuide.iban}</td>
              <td>{tourGuide.role === "TourGuide" ? "Tur Rehberi" : "Danışman"}</td>
              <td>
                {/* Promote to Expert Button (only if not already an Advisor) */}
                {tourGuide.role !== "Advisor" && (
                  <button
                    onClick={() => handlePromoteButtonClick(tourGuide)}
                    title="Danışmanlığa Yükselt"
                    className="usertable-button usertable-button-promote"
                  >
                    Danışmanlığa Yükselt
                  </button>
                )}
                {/* Delete Button */}
                <button className="usertable-button usertable-button-promote" onClick={() => removeRow(tourGuide.firstName, tourGuide.lastName, tourGuide.email)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Centered Button Below the Table */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/rehber-ekle">
          <button className="usertable-button usertable-button-add">
            Yeni Tur Rehberi Kaydet
          </button>
        </Link>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span
              className="popup-close-icon"
              onClick={() => setIsPopupOpen(false)}
            >
              ✖ {/* You can replace this with an icon from your preferred library */}
            </span>
            <h3>Danışmanın Sorumlu Olduğu Günü Seçin</h3>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Gün Seçin</option>
              <option value="Monday">Pazartesi</option>
              <option value="Tuesday">Salı</option>
              <option value="Wednesday">Çarşamba</option>
              <option value="Thursday">Perşembe</option>
              <option value="Friday">Cuma</option>
              <option value="Saturday">Cumartesi</option>
              <option value="Sunday">Pazar</option>
            </select>
            <div className="popup-buttons">
              <button onClick={promoteToExpert} className="usertable-button">
                Yükselt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourGuideList;
