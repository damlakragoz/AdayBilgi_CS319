import React from "react";
import "../common/Header.css";

import logo from "../assets/logo.png";
import { useNavigate, Link } from 'react-router-dom';

const MainPageHeader = ({ toggleSidebar }) => {
    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <Link to="/anasayfa" className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1>BTO AdayBilgi</h1>
                </Link>
            </div>
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Sitede ara..."
                />
                <i className="fas fa-search search-icon"></i>
            </div>
            <div className="nav-actions">
                <a href="#contact" className="nav-link iletisim-link">
                    İletişim
                </a>
                <button className="btn login-btn" onClick={() => window.location.href = '/login'}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default MainPageHeader;
