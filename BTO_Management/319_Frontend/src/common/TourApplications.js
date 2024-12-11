import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FairInvitations.css'; // Import the updated CSS file

const TourApplications = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
      const fetchData = async () => {
          try {
              // Retrieve the auth token from local storage
              const token = localStorage.getItem("userToken");
              if (!token) {
                  alert("Authorization token missing. Please log in.");
                  // Redirect to login page if needed
                  // window.location.href = '/login';
                  return;
              }

              // Log the token for debugging purposes (remove in production)
              console.log("Retrieved Token:", token);

              // Make the API request with authorization headers
              const response = await axios.get("http://localhost:8081/api/tour-applications/getAll", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
              });

              // Log the response and data
              console.log("API Response Status:", response.status);
              console.log("Tour Applications Data:", response.data);

              // Update the state with the fetched data
              setData(response.data);

          } catch (error) {
              console.error('Error fetching data:', error);
              alert("Failed to fetch tour applications. Please try again later.");
          }
      };

      fetchData();
  }, []);


  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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

  return (
    <div className="outer-container">
      <h1 className="title">Tur Başvuruları</h1>
      <div className="table-container">
        <table className="table">
                  <thead>
                    <tr>
                      <th>Başvuru Durumu</th>
                      <th>Lise Adı</th>
                      <th>Başvuran Rehber Öğretmen </th>
                      <th>Atanan Tur Tarihi</th>
                      <th>Seçilen Zaman Dilimi</th>
                      <th>İşlenme Zamanı</th>
                      <th>Talep Edilen Tarihler</th>
                      <th>Katılımcı Sayısı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((tourApplication, index) => (
                      <tr key={index}>
                        <td>{tourApplication.applicationStatus || "Belirtilmedi"}</td>
                        <td>{tourApplication.applyingHighschool?.schoolName || "Bilinmiyor"}</td>
                        <td>{tourApplication.applyingCounselor ? tourApplication.applyingCounselor.firstName : "Bilinmiyor"}</td>
                        <td>{tourApplication.selectedDate ? new Date(tourApplication.selectedDate).toLocaleString() : "Seçilmedi"}</td>
                        <td>{tourApplication.selectedTimeSlot || "Belirtilmedi"}</td>
                        <td>{tourApplication.transitionTime ? new Date(tourApplication.transitionTime).toLocaleString() : "Yok"}</td>
                        <td>
                          {tourApplication.requestedDates?.length
                            ? tourApplication.requestedDates.map((date, idx) => (
                                <div key={idx}>{new Date(date).toLocaleString()}</div>
                              ))
                            : "Talep Yok"}
                        </td>
                        <td>{tourApplication.visitorCount ? tourApplication.visitorCount:0 }</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
      </div>
      <div className="footer">
        <div className="pagination-info">
          {`Page ${currentPage} of ${totalPages}`}
        </div>
        <div className="arrow-navigation">
          <span
            className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePreviousPage}
          >
            {'<'}
          </span>
          <span
            className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
          >
            {'>'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TourApplications;
