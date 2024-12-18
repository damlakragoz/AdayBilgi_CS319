// ChangePassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./ChangePassword.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false,
    });

    const navigate = useNavigate(); // Initialize navigate function


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side Validation
        if (newPassword !== confirmPassword) {
            setErrorMessage("Parolalar eşleşmiyor!");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("Şifre en az 8 karakter uzunluğunda olmalı.");
            return;
        }

        // Get username and token
        const loggedInUsername = localStorage.getItem("username");
        const token = localStorage.getItem("userToken");

        if (!loggedInUsername || !token) {
            setErrorMessage("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
            return;
        }

        // API URL
        const url = "http://localhost:8081/api/user/changePassword";

        try {
            // Axios PUT Request
            const response = await axios.put(url, null, {
                params: {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    username: loggedInUsername
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Include token for authorization
                },
                withCredentials: true, // Send credentials if needed
            });

            // Success Handling
            alert("Şifre başarıyla değiştirildi.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrorMessage(""); // Clear any existing error messages
        } catch (error) {
            // Error Handling
            if (error.response && error.response.status === 401) {
                setErrorMessage("Mevcut şifreniz yanlış.");
            } else {
                setErrorMessage(
                    error.response
                        ? `Hata: ${error.response.data}`
                        : "Bir hata oluştu. Lütfen tekrar deneyiniz."
                );
            }
            console.error("Error changing password:", error);
        }
    };

    // Go back to the previous page
    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        navigate(-1); // Go to the previous page
    };

    return (
        <div className="change-password-container">
            <div className="header-title">
                <h2>Şifreyi Değiştir</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mevcut Şifreniz:</label>
                    <div className="password">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Yeni Şifreniz:</label>
                    <div className="password">
                        <input
                            type={showPassword.newPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                    </div>
                </div>
                <div className="form-group">
                    <label>Yeni Şifrenizi Onaylayın:</label>
                    <div className="password">
                        <input
                            type={showPassword.confirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        İptal et
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;