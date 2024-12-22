import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../common/Header.css";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import defaultProfilePicture from "../assets/default-profile-picture.jpg";

const CounselorHeader = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null); // State to store user data
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [profilePictureUrl, setProfilePictureUrl] = useState(
        localStorage.getItem("profilePictureUrl") || defaultProfilePicture
    );

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8081/api/profile/get-picture",
                    {
                        params: { username: localStorage.getItem("username") },
                        responseType: "blob", // Ensure the response is a binary image
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.size > 0) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfilePictureUrl(imageUrl);
                    localStorage.setItem("profilePictureUrl", imageUrl);
                } else {
                    setProfilePictureUrl(defaultProfilePicture);
                }
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };

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
        fetchProfilePicture();
    }, [localStorage.getItem("username")]);

    useEffect(() => {
        // Function to fetch user details
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    navigate("/login"); // Redirect to login if no token
                    return;
                }

                const email = localStorage.getItem("username");
                const response = await axios.get("http://localhost:8081/api/users/getByEmail", {
                    params: { email: email, },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data); // Set user data from the API response
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login"); // Redirect to login on error
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        setProfilePictureUrl(defaultProfilePicture);
        navigate("/login");
    };

    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <Link to="/anasayfa/rehber-ogretmen" className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>BTO AdayBilgi</h1>
                </Link>
            </div>
            <div className="nav-links">
                <a href="/anasayfa/rehber-ogretmen" className="nav-link">
                    Anasayfa
                </a>
                <a href="/applications" className="nav-link">
                    Başvurularım
                </a>
                <a href="#" className="nav-link">
                    Yaklaşan Etkinlikler
                </a>
                <div className="notification-container">
                    <Link to="/counselor-notifications" className="nav-link">
                        <i className="fas fa-bell"></i>
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </Link>
                </div>
                <div className="user-dropdown">
                    <div className="d-flex align-items-center">
                        <img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="user-avatar"
                        />
                        <div>
                            <span className="user-name">{user ? `${user.firstName} ${user.lastName}` : "User Name"}</span>
                            <div className="role">{localStorage.role== "Counselor" ? "Rehber Öğretmen" : localStorage.role}</div>
                        </div>
                        <i className="fas fa-caret-down ms-2"></i>
                    </div>
                    <div className="dropdown-menu">
                        <a href="/ogretmen-ayarlar">Ayarlar</a>
                        <a href="/ogretmen-sifre-degistir">Şifremi Değiştir</a>
                        <a onClick={handleLogout}>
                            Çıkış Yap
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorHeader;
