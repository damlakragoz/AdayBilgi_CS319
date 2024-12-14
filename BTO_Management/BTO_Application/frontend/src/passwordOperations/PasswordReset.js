import React from "react";
import "./PasswordReset.css";

const PasswordReset = () => {
    return (
        <div className="reset-page">
            <header className="header">
                <img
                    src="https://bilkent.edu.tr"
                    alt="Bilkent University Logo"
                    className="header-logo"
                />
            </header>
            <div className="container">
                <h2>Şifre Sıfırlama</h2>
                <p>Lütfen yeni şifrenizi giriniz.</p>
                <input type="password" placeholder="Yeni Şifrenizi Giriniz" />
                <input type="password" placeholder="Şifrenizi Yeniden Giriniz" />
                <div className="button-group">
                    <button className="cancel-btn">İptal</button>
                    <button className="submit-btn">Şifremi Onaylıyorum</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;

