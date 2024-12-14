// React Component (ForgotPassword.js)
import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    return (
        <div className="forgot-password-container">
            <header className="navbar">
                <div className="navbar-left">
                    <a href="#">\u0130leti\u015fim</a>
                    <a href="#">Foto\u011fraflarla Bilkent</a>
                    <a href="#">S\u0131k\u00e7a Sorulan Sorular</a>
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
                <h2>\u015eifremi Unuttum</h2>
                <p>L\u00fctfen \u015fifre s\u0131rlama linkinin g\u00f6nderilece\u011fi hesap mailinizi yaz\u0131n\u0131z:</p>
                <form className="form">
                    <input type="email" placeholder="E-mailinizi giriniz" required />
                    <div className="buttons">
                        <button type="button" className="cancel">\u0130ptal</button>
                        <button type="submit" className="confirm">Onayla</button>
                    </div>
                </form>
            </div>
            <footer className="footer">
                <a href="#">Gizlilik Politikası</a>
                <a href="#">Hizmet Ko\u015fullar\u0131</a>
                <a href="#">Bizimle \u0130leti\u015fime Ge\u00e7in</a>
                <p>\u00a9 2024 Bilkent \u00dcniversitesi. T\u00fcm haklar\u0131 sakl\u0131d\u0131r.</p>
            </footer>
        </div>
    );
};

export default ForgotPassword;


