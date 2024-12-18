import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";

const TourGuideSidebar = ({ isOpen, toggleSidebar }) => {
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
                {/* Subtitle: My Tours */}
                <li>
                    <Link to="/kullanici-islemleri" className="sidebar-subtitle">
                        Kullanici Islemleri
                    </Link>
                </li>
                <li><Link to="/tourguide-tourenrollment"className="nav-link text-white">
                    Turlara Başvur/Tur Takvimi
                </Link></li>
                <li><Link to="/basvur-fuar"className="nav-link text-white">
                    Fuara Başvur
                </Link></li>
                <li><Link to="/basvur-diger" className="nav-link text-white">
                    Diğer
                </Link></li>
                <li><Link to="/tourguide-puantage" className="nav-link text-white">
                Puantaj-Aktivite Giriş
                </Link></li>

                <br />
                {/* Subtitle: Notifications */}
                <li>
                    <Link to="/tourguide-notifications" className="sidebar-subtitle">
                        Bildirimler
                    </Link>
                </li>
                <li>
                    <Link to="/messages" className="nav-link text-white">
                        Mesajlarım
                    </Link>
                </li>

                <br />
                {/* Subtitle: Resources */}
                <li>
                    <Link to="/resources" className="sidebar-subtitle">
                        Kaynaklar
                    </Link>
                </li>
                <li>
                    <Link to="/tour-guidelines" className="nav-link text-white">
                        Tur Kılavuzları
                    </Link>
                </li>
                <li>
                    <Link to="/faqs" className="nav-link text-white">
                        Sıkça Sorulan Sorular
                    </Link>
                </li>

                <hr />
                {/* Settings and Logout */}
                <li>
                    <Link to="/settings" className="nav-link text-white">
                        Ayarlar
                    </Link>
                </li>
                <li>
                    <a onClick={handleLogout} className="nav-link text-white">
                        Çıkış Yap
                    </a>
                </li>

            </ul>
        </div>
    );
};

export default TourGuideSidebar;
