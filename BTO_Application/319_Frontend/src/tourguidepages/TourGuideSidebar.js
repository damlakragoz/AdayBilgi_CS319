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
                {/* Subtitle: Kullanıcı İşlemleri */}
                <li>
                    <Link to="/kullanici-islemleri" className="sidebar-subtitle">
                        <i className="fas fa-user-cog"></i> Kullanıcı İşlemleri
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-tourenrollment" className="nav-link text-white">
                        <i className="fas fa-calendar-alt"></i> Turlara Başvur/Tur Takvimi
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-all-fairs" className="nav-link text-white">
                        <i className="fas fa-briefcase"></i> Fuara Başvur
                    </Link>
                </li>
                <li>
                    <Link to="/basvur-diger" className="nav-link text-white">
                        <i className="fas fa-ellipsis-h"></i> Diğer
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-puantage" className="nav-link text-white">
                        <i className="fas fa-edit"></i> Puantaj-Aktivite Giriş
                    </Link>
                </li>

                <br />
                {/* Subtitle: Bildirimler */}
                <li>
                    <Link to="/tourguide-notifications" className="sidebar-subtitle">
                        <i className="fas fa-bell"></i> Bildirimler
                    </Link>
                </li>
                <li>
                    <Link to="/messages" className="nav-link text-white">
                        <i className="fas fa-envelope"></i> Mesajlarım
                    </Link>
                </li>

                <br />
                {/* Subtitle: Resources */}
                <li>
                    <Link to="/resources" className="sidebar-subtitle">
                        <i className="fas fa-book"></i> Kaynaklar
                    </Link>
                </li>
                <li>
                    <Link to="/tour-guidelines" className="nav-link text-white">
                        <i className="fas fa-map-signs"></i> Tur Kılavuzları
                    </Link>
                </li>
                <li>
                    <Link to="/faqs" className="nav-link text-white">
                        <i className="fas fa-question-circle"></i> Sıkça Sorulan Sorular
                    </Link>
                </li>

                <hr />
                {/* Settings and Logout */}
                <li>
                    <Link to="/settings" className="nav-link text-white">
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

export default TourGuideSidebar;
