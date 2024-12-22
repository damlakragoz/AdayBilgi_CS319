import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";
import defaultProfilePicture from "../assets/default-profile-picture.jpg";

const CounselorSidebar = ({ isOpen, toggleSidebar }) => {

    const navigate = useNavigate();
    const [profilePictureUrl, setProfilePictureUrl] = useState(
        localStorage.getItem("profilePictureUrl") || "default-profile-picture.jpg"
    );
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
                {/* Tur Başvurusu Yap */}
                <li className="nav-item">
                    <Link to="/create-tour-application" className="nav-link text-white">
                        <i className="fas fa-plus-circle"></i> Tur Başvurusu Yap
                    </Link>
                </li>

                {/* Tur Başvurularım */}
                <li className="nav-item">
                    <Link to="/tour-applications" className="nav-link text-white">
                        <i className="fas fa-list"></i> Tur Başvurularım
                    </Link>
                </li>

                {/* Geri Bildirimlerim */}
                <li className="nav-item">
                    <Link to="/my-feedbacks" className="nav-link text-white">
                        <i className="fas fa-comment-dots"></i> Geri Bildirimlerim
                    </Link>
                </li>

                {/* Fuar Davetiyesi Gönder */}
                <li className="nav-item">
                    <Link to="/send-fair-invitation" className="nav-link text-white">
                        <i className="fas fa-paper-plane"></i> Fuar Davetiyesi Gönder
                    </Link>
                </li>

                {/* Fuar Davetlerim */}
                <li className="nav-item">
                    <Link to="/fair-invitations" className="nav-link text-white">
                        <i className="fas fa-envelope-open-text"></i> Fuar Davetlerim
                    </Link>
                </li>

                {/* Bildirimlerim */}
                <li className="nav-item">
                    <Link to="/counselor-notifications" className="nav-link text-white">
                        <i className="fas fa-bell"></i> Bildirimlerim
                    </Link>
                </li>

                <hr />

                {/* Ayarlar */}
                <li className="nav-item">
                    <Link to="/ogretmen-ayarlar" className="nav-link text-white">
                        <i className="fas fa-cogs"></i> Ayarlar
                    </Link>
                </li>

                {/* Çıkış Yap */}
                <li className="nav-item">
                    <a onClick={handleLogout} className="nav-link text-white">
                        <i className="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default CounselorSidebar;
