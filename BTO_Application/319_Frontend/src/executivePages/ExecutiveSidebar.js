import React from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import "../common/Sidebar.css";
import defaultProfilePicture from "../assets/default-profile-picture.jpg"; // Update path if necessary

const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
};

const ExecutiveSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}> {/* Fixed className syntax */}
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                {/* Subtitle: Onay Bekleyenler */}
                <li>
                    <Link to="/onay-bekleyen-islemler/yonetici" className="sidebar-subtitle">
                        <i className="fas fa-tasks"></i> Onay Bekleyenler
                    </Link>
                </li>
                <li>
                    <Link to="/bto-koordinasyonu/yonetici" className="nav-link text-white">
                        <i className="fas fa-handshake"></i> BTO Koordinasyonu
                    </Link>
                </li>
                <li>
                    <Link to="/fuar-davetleri/yonetici" className="nav-link text-white">
                        <i className="fas fa-envelope-open-text"></i> Fuar Davetleri
                    </Link>
                </li>
                <li>
                    <Link to="/tur-basvurulari/yonetici" className="nav-link text-white">
                        <i className="fas fa-file-alt"></i> Tur Başvuruları
                    </Link>
                </li>
                <li>
                    <Link to="/bildirimler/yonetici" className="nav-link text-white">
                        <i className="fas fa-bell"></i> Bildirimlerim
                    </Link>
                </li>


                <br/>
                {/* Subtitle: Yaklaşan Etkinlikler */}
                <li>
                    <Link to="/yaklasan-etkinlikler/yonetici" className="sidebar-subtitle">
                        <i className="fas fa-calendar-alt"></i> Yaklaşan Etkinlikler
                    </Link>
                </li>
                <li>
                    <Link to="/tur-takvimi/yonetici" className="nav-link text-white">
                        <i className="fas fa-calendar-check"></i> Tur Takvimi
                    </Link>
                </li>
                <li>
                    <Link to="/yaklasan-fuarlar/yonetici" className="nav-link text-white">
                        <i className="fas fa-building"></i> Yaklaşan Fuarlar
                    </Link>
                </li>


                <br/>
                {/* Subtitle: Yaklaşan Etkinlikler */}
                <li>
                    <a  className="sidebar-subtitle">
                        Performans Analizi
                    </a>
                </li>
                <li>
                    <Link to="/istatistikler/yonetici" className="nav-link text-white">
                        <i className="fas fa-chart-bar"></i> İstatistikler
                    </Link>
                </li>
                <li>
                    <Link to="/geribildirimler/yonetici" className="nav-link text-white">
                        <i className="fas fa-comments"></i> Geribildirimler
                    </Link>
                </li>


                <hr/>
                {/* Settings and Logout */}
                <li>
                    <Link to="/yonetici-ayarlar" className="nav-link text-white">
                        <i className="fas fa-cogs"></i> Ayarlar
                    </Link>
                </li>
                <li className="nav-item">
                    <a onClick={handleLogout} className="nav-link text-white">
                        <i className="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default ExecutiveSidebar;
