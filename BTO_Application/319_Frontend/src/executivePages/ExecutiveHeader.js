import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import for navigation
import "../common/Header.css";
import logo from "../assets/logo.png";

const CoordinatorHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication data (example: localStorage or context)
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");// Adjust this as per your authentication logic
        // Redirect to login page
        navigate("/login");
    };

    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>BTO AdayBilgi</h1>
                </Link>
            </div>
            <div className="nav-links">
                <a href="/executive-homepage" className="nav-link">
                    Anasayfa
                </a>
                <a href="/onay-bekleyen-islemler" className="nav-link">
                    Onay Bekleyen İşlemler
                </a>
                <a href="#" className="nav-link">
                    Yaklaşan Etkinlikler
                </a>
                <i className="fas fa-bell"></i>
                <div className="user-dropdown">
                    <div className="d-flex align-items-center">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User Avatar"
                            className="user-avatar me-2"
                        />
                        <div>
                            <span className="user-name">{localStorage.username}</span>
                            <div className="role">{localStorage.role}</div>
                        </div>
                        <i className="fas fa-caret-down ms-2"></i>
                    </div>
                    <div className="dropdown-menu">
                        <a href="#">Şifremi Değiştir</a>
                        <a  onClick={handleLogout}>
                            Çıkış Yap
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorHeader;
