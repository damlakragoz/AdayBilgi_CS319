import React from "react";
import "./CoordinatorHeader.css";

const CoordinatorHeader = ({ toggleSidebar }) => {
    return (
        <div className="header">
            <div className="d-flex align-items-center">
                <i className="fas fa-bars me-3" onClick={toggleSidebar}></i>
                <img src="/logo.png" alt="Logo" className="logo" />
                <h1>BTO AdayBilgi</h1>
            </div>
            <div className="nav-links">
                <a href="#" className="nav-link">
                    Anasayfa
                </a>
                <a href="#" className="nav-link">
                    Onay Beklenen İşlemler
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
                            <span className="user-name">Boray Güvenç</span>
                            <div className="role">Koordinatör</div>
                        </div>
                        <i className="fas fa-caret-down ms-2"></i>
                    </div>
                    <div className="dropdown-menu">
                        <a href="#">Şifremi Değiştir</a>
                        <a href="#">Çıkış Yap</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorHeader;
