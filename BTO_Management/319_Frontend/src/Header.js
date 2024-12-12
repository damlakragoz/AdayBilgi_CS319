import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <div className="navbar">
            <div className="menu">
                <div>
                    <a href="#">Tur Başvuruları</a>
                    <div>
                        <a href="#">Başvuru Yap</a>
                        <a href="#">Başvurularım</a>
                        <a href="#">Başvurularımı Düzenle</a>
                        <a href="#">Geri Bildirimlerim</a>
                    </div>
                </div>
                <div>
                    <a href="#">Lise Fuarları</a>
                    <div>
                        <a href="#">Fuar Davetiyesi Gönder</a>
                        <a href="#">Davetlerim</a>
                    </div>
                </div>
            </div>
            <div className="search">
                <input type="text" placeholder="Sitede ara..." />
                <i className="fas fa-search"></i>
            </div>
            <div className="user-menu">
                <i className="fas fa-home"></i>
                <div>
                    <a href="#">Mehmet Ay Rehber Öğretmen</a>
                    <div>
                        <a href="#">Şifremi Değiştir</a>
                        <a href="#">Çıkış Yap</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
