import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import MainPageHeader from './MainPageHeader';
import MainPageSidebar from './MainPageSidebar';
import "../common/Sidebar.css";
import logo from "../assets/logo.png";

const MainPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(''); // State to store error message
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    useEffect(() => {
        // Clear tokens or perform other side effects
    }, []);


    return (
        <div className="main-page">
            <MainPageHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <MainPageSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? "with-sidebar" : ""
                    }`}
                >
                    {/* Main content */}
                </div>
            </div>

            {/* Main content area */}
            <main className="main-content">
                <h2>Explore Our Campus</h2>
                <p>Discover the beauty and facilities of our state-of-the-art campus through our guided tours.</p>
            </main>

            <footer className="main-footer">
                <p>© 2023 Bilkent University. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainPage;
