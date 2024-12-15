import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnayBekleyen.css';

const OnayBekleyenTurlar = () => {

    const [tours, setTours] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      // Function to fetch tours
      const fetchTours = async () => {
        try {
          const token = localStorage.getItem('userToken'); // Retrieve the auth token

          if (!token) {
            alert('Authorization token missing. Please log in.');
            return;
          }
          console.log('Retrieved Token:', token);

          const response = await axios.get('http://localhost:8081/api/tour/getAll', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          console.log(response.data);

          // Filter tours by tourStatus === 'Pending'
          const pendingTours = response.data.filter((tour) => tour.tourStatus === 'Pending');
          setTours(pendingTours);
          setError(null);
        } catch (err) {
          setError(err.response ? err.response.data : 'Error fetching data');
          setTours([]);
        } finally {
          setLoading(false);
        }
      };

      // Fetch tours on component load
      useEffect(() => {
        fetchTours();
      }, []);

  if (loading) {
    return <div className="onay-bekleyen-container">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="onay-bekleyen-container">{error}</div>;
  }

  return (
    <div className="onay-bekleyen-container">
      <h1 className="onay-bekleyen-header">Onay Bekleyen Tur Girişleri</h1>
      <table className= "onay-bekleyen-activity-table">
        <thead>
          <tr>
            <th>Tur Açıklaması</th>
            <th>Tur Tarihi</th>
            <th>Tercihler</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, index) => (
            <tr key={index}>
                <td>{tour.tourStatus}</td>
                <td>{new Date(tour.chosenDate).toLocaleString()}</td> {/* Display the chosenDate */}
                <td className="onay-bekleyen-buttons">
                <button className="onay-bekleyen-approve-btn">Onayla</button>
                <button className="onay-bekleyen-reject-btn">Reddet</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnayBekleyenTurlar;
