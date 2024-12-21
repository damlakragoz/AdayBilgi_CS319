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





  const promoteToExpert = async (firstName, lastName, email) => {
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
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
        );

        if ([200, 201, 202].includes(response.status)) {
          alert(`${firstName} ${lastName} danışmanlığa yükseltildi!`);
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
            <th>Puantaj</th>
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
              <td>{tourGuide.role=="TourGuide" ? "Tur Rehberi" : "Danışman"}</td>
              <td>
                {/* Promote to Expert Button (only if not already an Advisor) */}
                {tourGuide.role !== "Advisor" && (
                    <button
                        onClick={() =>
                            promoteToExpert(
                                tourGuide.firstName,
                                tourGuide.lastName,
                                tourGuide.email
                            )
                        }
                        title="Danışmanlığa Yükselt"
                        className="usertable-button usertable-button-promote"
                    >
                      Danışmanlığa Yükselt
                    </button>)}
                {/* Delete Button */}
                <button
                    onClick={() =>
                        removeRow(tourGuide.firstName, tourGuide.lastName, tourGuide.email)
                    }
                    className="usertable-button usertable-button-delete"
                >
                  🗑️ Sil
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{color: "red"}}>{error}</div>}

      {/* Centered Button Below the Table */}
      <div style={{textAlign: "center", marginTop: "20px"}}>
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
