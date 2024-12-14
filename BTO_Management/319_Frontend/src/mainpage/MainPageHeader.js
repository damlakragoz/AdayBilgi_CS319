import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './MainPageHeader.css';
import logo from '../assets/logo.png';

const MainPageHeader = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <header className="header">
            <div className="header-top">
                <nav className="header-nav">
                    <a href="#contact" className="header-link">İletişim</a>
                    <a href="#photos" className="header-link">Fotoğraflarla Bilkent</a>
                    <a href="#faq" className="header-link">Sıkça Sorulan Sorular</a>
                </nav>
                <div className="social-icons">
                    <i className="fab fa-facebook"></i>
                    <i className="fab fa-twitter"></i>
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-linkedin"></i>
                    <i className="fab fa-youtube"></i>
                </div>
            </div>
            <div className="header-main">
                <div className="logo-section">
                    <img src={logo} alt="Bilkent Üniversitesi Logo" className="logo"/>
                    <h1 className="logo-title">Bilkent Üniversitesi</h1>
                    <h2 className="logo-subtitle">Üniversite Adaylarına Bilgi</h2>
                </div>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Sitede ara..."
                />
                <div className={"button-section"}>
                    <button
                        className="btn login-btn"
                        onClick={() => navigate('/login')} // Navigate to login
                    >
                        Giriş Yap
                    </button>
                    <button
                        className="btn signup-btn"
                        onClick={() => navigate('/individual-application')} // Navigate to signup
                    >
                        Bizi Ziyaret Edin
                    </button>
                </div>

            </div>

        </header>
    );
};

export default MainPageHeader;
