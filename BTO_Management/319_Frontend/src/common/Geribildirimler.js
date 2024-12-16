import React, { useState } from "react";
import "./Geribildirimler.css";

const Geribildirimler = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      teacher: "Ayhan Altın",
      school: "Ankara Atatürk Anadolu Lisesi",
      date: "09.03.2024",
      comment: "Çok öğretici bir geziydi. Teşekkürler...",
    },
    {
      teacher: "Berat Balkır",
      school: "Robert Kolej",
      date: "09.09.2024",
      comment:
        "Bilkent Üniversitesi'ne yaptığımız gezinin öğrenciler üzerinde büyük bir etkisi oldu. Birçok kampüsteki sosyal imkanları, derslikleri ve laboratuvarları gördüğünde çok heyecanlandı...",
    },
    {
      teacher: "Doğan Demir",
      school: "Ankara Fen Lisesi",
      date: "10.10.2024",
      comment:
        "Öğrencilerimizin meslek seçimleri konusunda daha bilinçli kararlar almalarına yardımcı olacak bir geziydi. Kendi ilgilerini çeken bölümlerle tanıştılar...",
    },
    {
      teacher: "Akasya Akalın",
      school: "Bursa Fen Lisesi",
      date: "21.10.2024",
      comment:
        "Özellikle bilim ve mühendislik alanlarına ilgisi olan öğrenciler, üniversitenin araştırma merkezlerinde oldukça etkilendiler. Laboratuvarları görmek, projeler hakkında bilgi almak onları motive etti...",
    },
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(feedbacks.length / 5); // Change this logic based on your total feedback count.

  const handleViewDetails = (teacher) => alert(`Viewing details for ${teacher}`);
  const handleMarkAsRead = (teacher) => alert(`Marked as read: ${teacher}`);
  const handleDelete = (teacher) => alert(`Deleted feedback from: ${teacher}`);

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToLastPage = () => setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * 5;
  const currentFeedbacks = feedbacks.slice(startIndex, startIndex + 5);

  return (
    <div className="feedback-container">
      <h1>Geribildirimler</h1>
      <h2>Yeni Açılan Geribildirimler</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Rehber Öğretmen</th>
            <th>Okul</th>
            <th>Tarih</th>
            <th>Yorum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {currentFeedbacks.map((feedback, index) => (
            <tr key={index}>
              <td>{feedback.teacher}</td>
              <td>{feedback.school}</td>
              <td>{feedback.date}</td>
              <td>{feedback.comment}</td>
              <td>
                <button
                  className="details-btn"
                  onClick={() => handleViewDetails(feedback.teacher)}
                >
                  Detayları Gör
                </button>
                <button
                  className="mark-read-btn"
                  onClick={() => handleMarkAsRead(feedback.teacher)}
                >
                  Okundu Olarak İşaretle
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(feedback.teacher)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={goToFirstPage}>&laquo; İlk</button>
        <button onClick={goToPreviousPage}>‹ Önceki</button>
        <span>
          Sayfa {currentPage} / {totalPages}
        </span>
        <button onClick={goToNextPage}>Sonraki ›</button>
        <button onClick={goToLastPage}>Son &raquo;</button>
      </div>
    </div>
  );
};

export default Geribildirimler;
