import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";

const CounselorSidebar = ({ isOpen, toggleSidebar }) => {

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
                <li className="nav-item">
                    <Link to="/create-tour-application" className="nav-link text-white">
                        Tur Başvurusu Yap
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/tour-applications" className="nav-link text-white">
                        Tur Başvurularım
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/feedback" className="nav-link text-white">
                        Geri Bildirimlerim
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/send-fair-invitation" className="nav-link text-white">
                        Fuar Davetiyesi Gönder
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/fair-invitations" className="nav-link text-white">
                        Fuar Davetlerim
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/new-notifications" className="nav-link text-white">
                        Bildirimlerim
                    </Link>
                </li>
                <hr />
                <li className="nav-item">
                    <Link to="/settings" className="nav-link text-white">
                        Ayarlar
                    </Link>
                </li>
                <li className="nav-item">
                    <a  onClick={handleLogout} className="nav-link text-white">
                        Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default CounselorSidebar;
