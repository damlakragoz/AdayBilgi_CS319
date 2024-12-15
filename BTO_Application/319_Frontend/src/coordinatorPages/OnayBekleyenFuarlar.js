import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnayBekleyen.css';

const OnayBekleyenFuarlar = () => {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch fairs
  const fetchFairs = async () => {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve the auth token

      if (!token) {
        alert('Authorization token missing. Please log in.');
        return;
      }
      console.log('Retrieved Token:', token);

      const response = await axios.get('http://localhost:8081/api/fair/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log(response.data);

      // Filter fairs by fairStatus === 'Pending'
      const pendingFairs = response.data.filter((fair) => fair.fairStatus === 'Pending');
      setFairs(pendingFairs);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error fetching data');
      setFairs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch fairs on component load
  useEffect(() => {
    fetchFairs();
  }, []);

  if (loading) {
    return <div className="onay-bekleyen-container">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="onay-bekleyen-container">{error}</div>;
  }

  return (
    <div className="onay-bekleyen-container">
      <h1 className="onay-bekleyen-header">Onay Bekleyen Fuar Girişleri</h1>
      <table className="onay-bekleyen-activity-table">
        <thead>
          <tr>
            <th>Fuar Açıklaması</th>
            <th>Fuar Tarihi</th>
            <th>Tercihler</th>
          </tr>
        </thead>
        <tbody>
          {fairs.map((fair, index) => (
            <tr key={index}>
              <td>{fair.fairStatus}</td> {/* Changed from tourStatus to fairStatus */}
              <td>{new Date(fair.chosenDate).toLocaleString()}</td> {/* Display the chosenDate */}
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

export default OnayBekleyenFuarlar;
