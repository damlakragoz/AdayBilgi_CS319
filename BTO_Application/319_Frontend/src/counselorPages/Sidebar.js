import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-white">
                        Anasayfa
                    </Link>
                </li>
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
                    <Link to="/notifications" className="nav-link text-white">
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
                    <Link to="/logout" className="nav-link text-white">
                        Çıkış Yap
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
