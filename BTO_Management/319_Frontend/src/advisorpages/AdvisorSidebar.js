import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";

const AdvisorSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                <li>
                    <Link to="/advisor-tourenrollment" className="nav-link text-white">Başvur-Tur Takvimi</Link>
                </li>
                <li>
                    <Link to="/advisor-puantage" className="nav-link text-white">Puantaj-Aktivite Giriş</Link>
                </li>
                <li>
                    <a onClick={handleLogout} className="nav-link text-white">Çıkış Yap</a>
                </li>
            </ul>
        </div>
    );
};

export default AdvisorSidebar;
