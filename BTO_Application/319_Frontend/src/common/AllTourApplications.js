import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FairInvitations.css";
import { toast } from "react-toastify";

const timeSlots = [
  { id: "SLOT_9_10", displayName: "09:00-10:00" },
  { id: "SLOT_10_11", displayName: "10:00-11:00" },
  { id: "SLOT_11_12", displayName: "11:00-12:00" },
  { id: "SLOT_13_14", displayName: "13:00-14:00" },
  { id: "SLOT_14_15", displayName: "14:00-15:00" },
];

// Mapping of application status in English to Turkish
const statusMap = {
  Created: "Oluşturuldu",
  Pending: "Onay bekleniyor",
  Approved: "Onaylandı",
  Rejected: "Reddedildi",
  "Pre-rejected": "Reddedildi", // Map Pre-rejected to Reddedildi
  Cancelled: "Iptal edildi",
  Finished: "Tamamlandı", // Added Finished state
  default: "Oluşturuldu", // Handle unexpected statuses
};

const AllTourApplications = () => {
  const [schoolApplications, setSchoolApplications] = useState([]);
  const [individualApplications, setIndividualApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          toast.error("Authorization token missing. Lütfen giriş yapın.", {
            autoClose: 3000,
          });
          return;
        }

        // Fetch school applications
        const schoolResponse = await axios.get(
            "http://localhost:8081/api/tour-applications/getAll/school-applications",
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
        );
        setSchoolApplications(schoolResponse.data);

        // Fetch individual applications
        const individualResponse = await axios.get(
            "http://localhost:8081/api/tour-applications/getAll/individual-applications",
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
        );
        setIndividualApplications(individualResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
            "Tur başvuruları veri tabanından alınamadı. Lütfen daha sonra tekrar deneyin.",
            { autoClose: 3000 }
        );
      }
    };

    fetchApplications();
  }, []);

  console.log(individualApplications)
  console.log(schoolApplications)

  // Combine school and individual applications
  const combinedApplications = [
    ...schoolApplications.map((app) => ({
      ...app,
      type: "school",
    })),
    ...individualApplications.map((app) => ({
      ...app,
      type: "individual",
    })),
  ];

  // Calculate total pages and current data for the current page
  const totalPages = Math.ceil(combinedApplications.length / rowsPerPage);
  const currentData = combinedApplications.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Geçersiz Tarih" : parsedDate.toLocaleString();
  };

  const getTimeSlotDisplayName = (slotId) => {
    const slot = timeSlots.find((slot) => slot.id === slotId);
    return slot ? slot.displayName : "Belirtilmedi"; // Fallback if no match
  };

  const mapStatusToTurkish = (status) => {
    // Add console log to verify the incoming status
    console.log("Incoming status:", status);

    // Normalize the status to match the keys in the `statusMap`
    const normalizedStatus =
        status && typeof status === "string"
            ? status.trim().replace(/_/g, "-").toLowerCase()
            : "default";

    // Match the normalized status to the map
    const mappedStatus = Object.keys(statusMap).find(
        (key) => key.toLowerCase() === normalizedStatus
    );

    // Return the mapped status or fallback to "default"
    return statusMap[mappedStatus] || statusMap.default;
  };


  return (
      <div className="fair-tour-lists-outer-container">
        <h1 className="fair-tour-lists-title">Tur Başvuruları</h1>
        <div className="fair-tour-lists-table-container">
          <table className="fair-tour-lists-table">
            <thead>
            <tr>
              <th>Başvuru Türü</th>
              <th>Başvuru Durumu</th>
              <th>Lise Adı</th>
              <th>Başvuran Rehber Öğretmen</th>
              <th>Atanan Tur Tarihi</th>
              <th>Katılımcı Sayısı</th>
            </tr>
            </thead>
            <tbody>
            {currentData.map((app, index) => (
                <tr key={index}>
                  <td>
                    {app.type === "school" ? "Okul Başvurusu" : "Bireysel Başvuru"}
                  </td>
                  <td>{mapStatusToTurkish(app.applicationStatus)}</td>
                  <td>{app.schoolName}</td>
                  <td>{app.applyingCounselorEmail|| "-"}</td>
                  <td>
                    {app.selectedDate ? formatDate(app.selectedDate) : "Seçilmedi"}
                  </td>
                  <td>{app.visitorCount}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="fair-tour-lists-footer">
          <div className="fair-tour-lists-pagination-info">
            {`Sayfa ${currentPage} / ${totalPages}`}
          </div>
          <div className="fair-tour-lists-arrow-navigation">
          <span
              className={`fair-tour-lists-arrow ${
                  currentPage === 1 ? "disabled" : ""
              }`}
              onClick={handlePreviousPage}
          >
            {"<"}
          </span>
            <span
                className={`fair-tour-lists-arrow ${
                    currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={handleNextPage}
            >
            {">"}
          </span>
          </div>
        </div>
      </div>
  );
};

export default AllTourApplications;
