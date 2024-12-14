// ChangePassword.js
import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage("Parolalar eşleşmiyor");
            return;
        }
        if (newPassword.length < 8 || !/[!@#$%^&*]/.test(newPassword)) {
            setErrorMessage(
                "Şifre en az 8 karakter uzunluğunda olmalı ve özel karakter içermelidir."
            );
            return;
        }
        setErrorMessage("");
        alert("Şifre başarıyla değiştirildi");
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    return (
        <div className="change-password-container">
            <h2>Şifreyi Değiştir</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Şuanki Şifreniz</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Yeni Şifreniz</label>
                    <div className="password-input">
                        <input
                            type={showPassword.newPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("newPassword")}
                        >
                            {showPassword.newPassword ? "Gizle" : "Göster"}
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Yeni Şifreyi Onayla</label>
                    <div className="password-input">
                        <input
                            type={showPassword.confirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                        >
                            {showPassword.confirmPassword ? "Gizle" : "Göster"}
                        </button>
                    </div>
                </div>
                <p className="password-requirements">
                    Şifre en az 8 karakter uzunluğunda olmalı ve özel karakter içermelidir.
                </p>
                {errorMessage && <p className="error-message">Hata: {errorMessage}</p>}
                <div className="button-group">
                    <button type="submit" className="save-button">
                        Kaydet
                    </button>
                    <button type="button" className="cancel-button">
                        İptal et
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;

