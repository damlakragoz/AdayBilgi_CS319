import React from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import "../common/Sidebar.css"; // Update path if necessary

const ExecutiveSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                {/* Subtitle: Onay Bekleyenler */}
                <li>
                    <Link to="/exec-onay-bekleyen-islemler" className="sidebar-subtitle">
                        Onay Bekleyenler
                    </Link>
                </li>
                <li>
                    <Link to="/bto-koordinasyonu" className="nav-link text-white">
                        BTO Koordinasyonu

                    </Link>
                </li>
                <li>
                    <Link to="/fuar-davetleri" className="nav-link text-white">Fuar Davetleri</Link>
                </li>
                <li>
                    <Link to="/tur-basvurulari" className="nav-link text-white">Tur Başvuruları</Link>
                </li>
                <li>
                    <Link to="/geribildirimler" className="nav-link text-white">Geribildirimler</Link>
                </li>


                <br/>
                {/* Subtitle: Yaklaşan Etkinlikler */}
                <li>
                    <Link to="/yaklasan-etkinlikler" className="sidebar-subtitle">
                        Yaklaşan Etkinlikler
                    </Link>
                </li>
                <li>
                    <Link to="/tur-takvimi" className="nav-link text-white">Tour Schedule</Link>
                </li>
                <li>
                    <Link to="/fuar-takvimi" className="nav-link text-white">Fuar Takvimi</Link>
                </li>
                <li>
                    <Link to="/executive-notifications" className="nav-link text-white">
                        Bildirimlerim
                    </Link>
                </li>
                <li>
                    <Link to="/executive-statistics" className="nav-link text-white">
                        İstatistikler
                    </Link>
                </li>

                <hr/>
                {/* Settings and Logout */}
                <li>
                    <Link to="/ayarlar" className="nav-link text-white">
                        Ayarlar
                    </Link>
                </li>
                <li>
                    <Link to="/logout" className="nav-link text-white">
                        Çıkış Yap
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default ExecutiveSidebar;
