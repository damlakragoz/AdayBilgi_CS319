import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../common/Header.css";
import logo from "../assets/logo.png";

const AdvisorHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <Link to="/advisor-homepage" className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>Advisor</h1>
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/advisor-tourenrollment" className="nav-link">Başvur-Tur Takvimi</Link>
                <Link to="/advisor-puantage" className="nav-link">Puantaj-Aktivite Giriş</Link>
                <i className="fas fa-bell"></i>
                <div className="user-dropdown">
                    <div className="d-flex align-items-center">
                        <span className="user-name">{localStorage.username}</span>
                        <div className="role">{localStorage.role}</div>
                        <i className="fas fa-caret-down ms-2"></i>
                    </div>
                    <div className="dropdown-menu">
                        <a href="/advisor-change-password">Şifremi Değiştir</a>
                        <a onClick={handleLogout}>Çıkış Yap</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorHeader;
