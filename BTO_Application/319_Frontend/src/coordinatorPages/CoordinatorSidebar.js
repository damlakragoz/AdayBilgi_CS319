import React from "react";
import { Link , useNavigate} from "react-router-dom"; // Use Link for navigation
import "../common/Sidebar.css"; // Update path if necessary

const CoordinatorSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication data (example: localStorage or context)
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role"); // Adjust this as per your authentication logic
        // Redirect to login page
        navigate("/login");
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                {/* Subtitle: Onay Bekleyen İşlemler */}
                <li>
                    <Link to="/onay-bekleyen-islemler" className="sidebar-subtitle">
                        <i className="fas fa-hourglass-half"></i> Onay Bekleyen İşlemler
                    </Link>
                </li>
                <li>
                    <Link to="/bto-koordinasyonu" className="nav-link text-white">
                        <i className="fas fa-sitemap"></i> BTO Koordinasyonu
                    </Link>
                </li>
                <li>
                    <Link to="/fuar-davetleri" className="nav-link text-white">
                        <i className="fas fa-envelope-open-text"></i> Fuar Davetleri
                    </Link>
                </li>
                <li>
                    <Link to="/tur-basvurulari" className="nav-link text-white">
                        <i className="fas fa-file-alt"></i> Tur Başvuruları
                    </Link>
                </li>
                <li>
                    <Link to="/geribildirimler/coordinator" className="nav-link text-white">
                        <i className="fas fa-comments"></i> Geribildirimler
                    </Link>
                </li>
                <li>
                    <Link to="/ödemeler/coordinator" className="nav-link text-white">
                        <i className="fas fa-money-check-alt"></i> Ödemeler
                    </Link>
                </li>

                <br />
                {/* Subtitle: Yaklaşan Etkinlikler */}
                <li>
                    <span className="sidebar-subtitle">
                        <i className="fas fa-calendar-alt"></i> Yaklaşan Etkinlikler
                    </span>
                </li>
                <li>
                    <Link to="/coordinator-tour-schedule" className="nav-link text-white">
                        <i className="fas fa-route"></i> Tur Takvimi
                    </Link>
                </li>
                <li>
                    <Link to="/fuar-takvimi" className="nav-link text-white">
                        <i className="fas fa-calendar-check"></i> Fuar Takvimi
                    </Link>
                </li>
                <li>
                    <Link to="/coordinator-notifications" className="nav-link text-white">
                        <i className="fas fa-bell"></i> Bildirimlerim
                    </Link>
                </li>

                <br />
                {/* Subtitle: Performans Analizi */}
                <li>
                    <span className="sidebar-subtitle">
                        <i className="fas fa-chart-line"></i> Performans Analizi
                    </span>
                </li>
                <li>
                    <Link to="/executive-statistics" className="nav-link text-white">
                        <i className="fas fa-chart-bar"></i> İstatistikler
                    </Link>
                </li>
                <li>
                    <Link to="/geribildirimler/coordinator" className="nav-link text-white">
                        <i className="fas fa-comments"></i> Geribildirimler
                    </Link>
                </li>

                <hr />
                {/* Settings and Logout */}
                <li>
                    <Link to="/ayarlar" className="nav-link text-white">
                        <i className="fas fa-cogs"></i> Ayarlar
                    </Link>
                </li>
                <li>
                    <a onClick={handleLogout} className="nav-link text-white">
                        <i className="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default CoordinatorSidebar;