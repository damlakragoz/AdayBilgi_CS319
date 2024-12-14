import React from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import "../common/Sidebar.css"; // Update path if necessary

const CoordinatorSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                {/* ONAY BEKLEYENLER */}
                <li className="nav-item">
                    <Link to="/onay-bekleyen-islemler" className="nav-link text-white">
                        Onay Bekleyen İşlemler
                    </Link>
                </li>
                <li>
                    <Link to="/onay-bekleyen-islemler">Onay Bekleyen İşlemler</Link>
                </li>
                <li>
                    <Link to="/bto-koordinasyonu">BTO Koordinasyonu</Link>
                </li>
                <li>
                    <Link to="/fuar-davetleri">Fuar Davetleri</Link>
                </li>
                <li>
                    <Link to="/tur-basvurulari" className="nav-link text-white">Tur Başvuruları</Link>
                </li>
                <li className="nav-item">
                    <Link to="/geribildirimler" className="nav-link text-white">Geribildirimler</Link>
                </li>

                {/* YAKLASAN ETKINLIKLER */}
                <li className="nav-item">
                    <Link to="/yaklasan-etkinlikler" className="nav-link text-white">
                        Yaklaşan Etkinlikler
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/tur-takvimi">Tour Schedule</Link>
                </li>
                <li className="nav-item">
                    <Link to="/fuar-takvimi">Fuar Takvimi</Link>
                </li>


                <li className="nav-item">
                    <Link to="/bildirimler" className="nav-link text-white">
                        Bildirimlerim
                    </Link>
                </li>

                <hr />
                {/* Settings and Logout */}
                <li className="nav-item">
                    <Link to="/ayarlar" className="nav-link text-white">
                        Ayarlar
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/logout" className="nav-link text-white">
                        Çıkış Yap
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default CoordinatorSidebar;
