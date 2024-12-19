import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
    const location = useLocation(); // Access the location object
    const email = location.state?.email || ""; // Extract email from state
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that passwords match
        if (newPassword !== confirmPassword) {
            setErrorMessage("Şifreler uyuşmuyor!");
            return;
        }

        try {
            // Send request to reset password
            const response = await axios.put(
                "http://localhost:8081/api/user/resetPassword",
                null, // No body, only parameters
                {
                    params: {
                        email,
                        code,
                        newPassword,
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccessMessage("Şifreniz başarıyla sıfırlandı.");
            setErrorMessage("");
            alert("Şifreniz başarıyla sıfırlandı.");
            navigate("/login"); // Navigate to Reset Password Page
        } catch (error) {
            setErrorMessage(
                error.response?.data || "Bir hata oluştu. Lütfen tekrar deneyiniz."
            );
            setSuccessMessage("");
            console.log(error);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <h2>Şifre Sıfırla</h2>
                <p>Lütfen aldığınız kodu ve yeni şifrenizi giriniz.</p>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <input
                        type="text"
                        placeholder="Kod"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="input-field"
                    />

                    <input
                        type="password"
                        placeholder="Yeni Şifre"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-field"
                    />

                    <input
                        type="password"
                        placeholder="Yeni Şifreyi Onaylayın"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-field"
                    />

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && (
                        <p className="success-message">{successMessage}</p>
                    )}

                    <button type="submit" className="reset-button">
                        Şifreyi Sıfırla
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
