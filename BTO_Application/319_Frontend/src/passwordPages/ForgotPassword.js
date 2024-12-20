import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState(""); // Email input state
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button disable state
    const [isLoading, setIsLoading] = useState(false); // Loading screen state
    const navigate = useNavigate();

    // Handle Cancel: Go to Previous Page
    const handleCancel = () => {
        window.history.back();
    };

    // Handle Submit: Send Email to Server
    const handleSubmit = async (e) => {
        e.preventDefault();

        /*
        if (newPassword.length < 8) {
            setErrorMessage("Şifre en az 8 karakter uzunluğunda olmalı.");
            return;
        }

         */
        
        setIsButtonDisabled(true); // Disable the button immediately
        setIsLoading(true); // Show loading screen

        try {
            await axios.post("http://localhost:8081/api/user/forgotPassword", null, {
                params: { email }, // Use email state here
            });
            alert("Kod e-posta adresinize gönderildi.");
            setIsLoading(false);
            navigate("/reset-password", { state: { email } }); // Pass email as state
        } catch (error) {
            setErrorMessage(
                error.response?.data || "Bir hata oluştu. Lütfen tekrar deneyiniz."
            );
        } finally {
            // Re-enable the button after 10 seconds
            setTimeout(() => setIsButtonDisabled(false), 10000);
            setIsLoading(false); // Hide loading screen
        }
    };

    return (
        <div className="forgot-password-page">
            {/* Show Loading Screen */}
            {isLoading && (
                <div className="loading-screen">
                    <p>Yükleniyor...</p>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && (
                <div className="forgot-password-container">
                    <div className="content">
                        <h2>Şifremi Unuttum</h2>
                        <p>Lütfen şifre sıfırlama kodunun gönderileceği mail adresini giriniz.</p>
                        <form className="form" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <input
                                type="email"
                                placeholder="E-mailinizi giriniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Update email state
                                required
                                className="input-field"
                            />
                            {/* Error Message */}
                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            {/* Buttons */}
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
                                    disabled={isButtonDisabled} // Disable button dynamically
                                >
                                    {isButtonDisabled ? "Lütfen Bekleyiniz..." : "Onayla"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
