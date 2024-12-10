import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Anasayfa
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Tur Başvurusu Yap
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Tur Başvurularım
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Tur Başvurularımı Düzenle
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Geri Bildirimlerim
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Fuar Davetiyesi Gönder
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Fuar Davetlerim
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Bildirimlerim
                    </a>
                </li>
                <hr />
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Ayarlar
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white">
                        Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
