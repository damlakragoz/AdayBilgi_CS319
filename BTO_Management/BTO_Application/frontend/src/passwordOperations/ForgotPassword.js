import React, { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    return (
        <div className="forgot-password-container">
            <header className="navbar">
                <div className="navbar-left">
                    <a href="#">İletişim</a>
                    <a href="#">Fotoğraflarla Bilkent</a>
                    <a href="#">Sıkça Sorulan Sorular</a>
                </div>
                <div className="navbar-right">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
            </header>
            <div className="content">
                <h2>Şifremi Unuttum</h2>
                <p>Lütfen şifre sıfırlama linkinin gönderileceği hesap mailini yazınız</p>
                <form className="form">
                    <input type="email" placeholder="E-mailinizi giriniz" required />
                    <div className="buttons">
                        <button type="button" className="cancel">İptal</button>
                        <button type="submit" className="confirm">Onayla</button>
                    </div>
                </form>
            </div>
            <footer className="footer">
                <p>
                    <a href="#">Gizlilik Politikası</a> | <a href="#">Hizmet Koşulları</a> |{" "}
                    <a href="#">Bizimle İletişime Geçin</a>
                </p>
                <p>© 2024 Bilkent Üniversitesi. Tüm hakları saklıdır.</p>
            </footer>
        </div>
    );
};

export default ForgotPassword;


