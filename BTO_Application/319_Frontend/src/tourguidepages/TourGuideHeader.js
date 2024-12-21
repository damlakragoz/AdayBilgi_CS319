import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import for navigation
import "../common/Header.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import axios from "axios";

const TourGuideHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch all notifications and calculate unread count
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    toast.error("Yetkilendirme başarısız. Lütfen giriş yapın.", {
                        position: "top-center",
                        autoClose: 5000,
                        onClose: () => navigate("/login"),
                    });
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8081/api/notifications/all",
                    {
                        params: { receiverName: localStorage.getItem("username") },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const allNotifications = response.data || [];
                const unreadNotifications = allNotifications.filter(
                    (notification) => !notification.isRead
                );

                setUnreadCount(unreadNotifications.length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                toast.error("Bildirimler alınırken hata oluştu.", {
                    position: "top-center",
                    autoClose: 5000,
                });
            }
        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {
        // Clear authentication data (example: localStorage or context)
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role"); // Adjust this as per your authentication logic
        // Redirect to login page
        navigate("/login");
    };

    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <Link to="/anasayfa" className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>BTO AdayBilgi</h1>
                </Link>
            </div>
            <div className="nav-links">
                <a href="/kullanici-islemleri" className="nav-link">
                    Kullanıcı İşlemleri
                </a>
                <a href="/tourguide-all-tours" className="nav-link">
                    Güncel Turlar
                </a>
                <div className="notification-container">
                    <Link to="/tourguide-notifications" className="nav-link">
                        <i className="fas fa-bell"></i>
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </Link>
                </div>
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
                        <a href="/tourguide-change-password">Şifremi Değiştir</a>
                        <a onClick={handleLogout}>
                        Çıkış Yap
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourGuideHeader;
