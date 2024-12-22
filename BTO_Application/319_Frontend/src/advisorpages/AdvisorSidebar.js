import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";
import defaultProfilePicture from "../assets/default-profile-picture.jpg";

const AdvisorSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setProfilePictureUrl(defaultProfilePicture);
        navigate("/login");
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                <li>
                    <a className="sidebar-subtitle">
                        <i className="fas fa-user-cog"></i> Kullanıcı İşlemleri
                    </a>
                </li>
                {/* Başvur-Tur Takvimi */}
                <li>
                    <Link to="/advisor-tourenrollment" className="nav-link text-white">
                        <i className="fas fa-calendar-alt"></i> Tur Takvimi - Başvur
                    </Link>
                </li>
                <li>
                    <Link to="/advisor-all-fairs" className="nav-link text-white">
                        <i className="fas fa-briefcase"></i> Fuar Takvimi - Başvur
                    </Link>
                </li>


                {/* Puantaj-Aktivite Giriş */}
                <li>
                    <Link to="/advisor-puantage" className="nav-link text-white">
                        <i className="fas fa-edit"></i> Puantaj - Aktivite Giriş
                    </Link>
                </li>

                {/* Tour Withdraw Requests */}
                <li>
                    <Link to="/withdraw-requests" className="nav-link text-white">
                        <i className="fas fa-clipboard-list"></i> Turdan Çekilme İstekleri
                    </Link>
                </li>

                <hr/>

                {/* Çıkış Yap */}
                <li>
                    <Link to="/danisman-ayarlar" className="nav-link text-white">
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

export default AdvisorSidebar;
