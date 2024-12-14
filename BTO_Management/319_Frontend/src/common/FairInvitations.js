import React, { useState } from 'react';
import './FairInvitations.css'; // Import the updated CSS file

const FairInvitations = () => {
  const data = [
    { bto: '/', katilim: 'Onay bekliyor', lise: 'Atatürk Fen Lisesi', sehir: 'İzmir', tarih: '13.10.2025', saat: '9.00-17.00' },
    { bto: '/', katilim: 'Onay Bekliyor', lise: 'Nesibe Aydın', sehir: 'Konya', tarih: '13.10.2025', saat: '9.00-17.00' },
    { bto: 'Hayır', katilim: 'Katılınacak', lise: 'Bilfen', sehir: 'Bursa', tarih: '15.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Ankara Atatürk Anadolu Lisesi', sehir: 'Ankara', tarih: '17.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Bursa Anadolu Lisesi', sehir: 'Bursa', tarih: '18.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Çapa Fen Lisesi', sehir: 'İstanbul', tarih: '23.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Robert Koleji', sehir: 'İstanbul', tarih: '23.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Ted', sehir: 'Malatya', tarih: '24.10.2025', saat: '9.00-17.00' },
    // Additional rows for testing
    { bto: '/', katilim: 'Onay bekliyor', lise: 'Yeditepe Lisesi', sehir: 'İstanbul', tarih: '25.10.2025', saat: '9.00-17.00' },
    { bto: '/', katilim: 'Onay bekliyor', lise: 'Ankara Fen Lisesi', sehir: 'Ankara', tarih: '26.10.2025', saat: '9.00-17.00' },
    { bto: 'Hayır', katilim: 'Katılınacak', lise: 'Marmara Koleji', sehir: 'İstanbul', tarih: '27.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Koç Lisesi', sehir: 'İstanbul', tarih: '28.10.2025', saat: '9.00-17.00' },
    { bto: 'Evet', katilim: 'Katılınacak', lise: 'Bilkent Lisesi', sehir: 'Ankara', tarih: '29.10.2025', saat: '9.00-17.00' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

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
    <div className="fair-tour-lists-outer-container">
      <h1 className="fair-tour-lists-title">Fuar Davetleri</h1>
      <div className="fair-tour-lists-table-container">
        <table className="fair-tour-lists-table">
          <thead>
            <tr>
              <th>BTO'ya bildirildi</th>
              <th>Katılım Durumu</th>
              <th>Lise Adı</th>
              <th>Şehir</th>
              <th>Tarih</th>
              <th>Fuar Saatleri</th>
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>{item.bto}</td>
                <td>{item.katilim}</td>
                <td>{item.lise}</td>
                <td>{item.sehir}</td>
                <td>{item.tarih}</td>
                <td>{item.saat}</td>
                <td>
                  {/* Conditional Button Render */}
                  {item.katilim !== 'Katılınacak' ? (
                    <button className="fair-tour-lists-bto-button">Fuari Onayla</button>
                  ) : (
                    <button className="fair-tour-lists-bto-button-approved">Onaylandi</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fair-tour-lists-footer">
        <div className="fair-tour-lists-pagination-info">
          {`Page ${currentPage} of ${totalPages}`}
        </div>
        <div className="fair-tour-lists-arrow-navigation">
          <span
            className={`fair-tour-lists-arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePreviousPage}
          >
            {'<'}
          </span>
          <span
            className={`fair-tour-lists-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
          >
            {'>'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FairInvitations;
