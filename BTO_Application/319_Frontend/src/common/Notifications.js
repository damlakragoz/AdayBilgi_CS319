import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Notifications.css";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("unread");
  const notifications = [
    {
      title: "Tur Onayı Gerekiyor",
      details: "Sistem Bildirimi - Saat 17.00'ye kadar tur onayı gerekiyor",
      date: "12 Ekim 2023 10:30",
    },
    {
      title: "Örsen Örge'den Yeni Mesaj",
      details: "Örsen Örge - Lütfen ekteki belgeyi incele",
      date: "11 Ekim 2023 15:15",
    },
    {
      title: "Etkinlik Hatırlatıcısı",
      details: "Sistem Bildirimi - 20 Kasım'da yaklaşan etkinlik",
      date: "10 Ekim 2023 09:00",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="notifications-page-container">
      <h1 className="notifications-header">Bildirimlerim</h1>

      <div className="notifications-tabs">
        <button
          className={`tab-button ${activeTab === "unread" ? "active-tab" : ""}`}
          onClick={() => handleTabChange("unread")}
        >
          Okunmamışlar
        </button>
        <button
          className={`tab-button ${activeTab === "read" ? "active-tab" : ""}`}
          onClick={() => handleTabChange("read")}
        >
          Okuduklarım
        </button>
        <button
          className={`tab-button ${activeTab === "priority" ? "active-tab" : ""}`}
          onClick={() => handleTabChange("priority")}
        >
          Öncelikli Olanlar
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-card">
            <h2 className="notification-title">{notification.title}</h2>
            <p className="notification-details">{notification.details}</p>
            <span className="notification-date">{notification.date}</span>

            <div className="notification-actions">
              <button className="email-button">
                <FontAwesomeIcon icon={faArchive} />
              </button>
              <button className="delete-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button className="pagination-button">Önceki</button>
        <button className="pagination-button">Sonraki</button>
      </div>

      <div className="notifications-footer">Sayfa 1 / 5</div>
    </div>
  );
};

export default Notifications;
