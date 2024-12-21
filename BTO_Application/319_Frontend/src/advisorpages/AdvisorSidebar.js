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
                {/* Başvur-Tur Takvimi */}
                <li>
                    <Link to="/advisor-tourenrollment" className="nav-link text-white">
                        <i className="fas fa-calendar-alt"></i> Başvur-Tur Takvimi
                    </Link>
                </li>

                {/* Puantaj-Aktivite Giriş */}
                <li>
                    <Link to="/advisor-puantage" className="nav-link text-white">
                        <i className="fas fa-edit"></i> Puantaj-Aktivite Giriş
                    </Link>
                </li>

                {/* Tour Withdraw Requests */}
                <li>
                    <Link to="/withdraw-requests" className="nav-link text-white">
                        <i className="fas fa-clipboard-list"></i> Tour Withdraw Requests
                    </Link>
                </li>

                {/* Çıkış Yap */}
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
