import React from 'react';
import './OnayBekleyen.css';

const OnayBekleyenTurlar = () => {


  return (
    <div className="onay-bekleyen-container">
      <h1 className="onay-bekleyen-header">Onay Bekleyen Aktivite Girişleri</h1>
      <table className="onay-bekleyen-activity-table">
        <thead>
          <tr>
            <th>Görev Açıklaması</th>
            <th>İsteyen</th>
            <th>Gönderilme Tarihi</th>
            <th>Tercihler</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.taskDescription}</td>
              <td>{activity.requester}</td>
              <td>{activity.submissionDate}</td>
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