import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const handleCancel = () => {
        window.history.back(); // Navigate to the previous page
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="content">
                    <h2>Şifremi Unuttum</h2>
                    <p>Lütfen şifre sıfırlama linkinin gönderileceği mail adresini giriniz.</p>
                    <form className="form">
                        <input
                            type="email"
                            placeholder="E-mailinizi giriniz"
                            required
                            className="input-field"
                        />
                        <div className="buttons">
                            <button
                                type="button"
                                className="cancellation-button"
                                onClick={handleCancel}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="confirm-button"
                            >
                                Onayla
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
