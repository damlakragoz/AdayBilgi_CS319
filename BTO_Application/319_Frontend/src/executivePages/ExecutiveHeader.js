import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import for navigation
import "../common/Header.css";
import axios from "axios";
import logo from "../assets/logo.png";

const ExecutiveHeader = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null); // State to store user data
    const navigate = useNavigate();

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
                <a href="/onay-bekleyen-islemler/executive" className="nav-link">
                    Onay Bekleyen İşlemler
                </a>
                <a href="/yaklasan-etkinlikler/yonetici" className="nav-link">
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
                            <span className="user-name">{user ? `${user.firstName} ${user.lastName}` : "User Name"}</span>
                            <div className="role">{localStorage.role== "Executive" ? "Yönetici" : localStorage.role}</div>
                        </div>
                        <i className="fas fa-caret-down ms-2"></i>
                    </div>
                    <div className="dropdown-menu">
                        <a href="/executive-change-password">Şifremi Değiştir</a>
                        <a onClick={handleLogout}>
                        Çıkış Yap
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveHeader;
