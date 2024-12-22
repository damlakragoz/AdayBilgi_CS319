import React, { useEffect, useState } from "react";
import axios from "axios";
import '../common/UserSettings.css';

const CounselorSettings = () => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const username = localStorage.getItem("username");

                if (!token || !username) return;

                const response = await axios.get(
                    `http://localhost:8081/api/profile/get-picture`,
                    {
                        params: { username },
                        responseType: "blob", // Fetch image as binary
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const url = URL.createObjectURL(response.data); // Create a URL for the image
                setProfilePictureUrl(url);
            } catch (error) {
                console.error("Failed to fetch profile picture:", error);
            }
        };

        fetchProfilePicture();
    }, []);

    return (
        <div className="settings-container">
            <h2>Kullanıcı Ayarları</h2>
            <div className="profile-section">
                <div className="profile-picture-wrapper">
                    {profilePictureUrl ? (
                        <img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="profile-picture"
                        />
                    ) : (
                        <p>No Profile Picture</p>
                    )}
                </div>
                <ul className="settings-list">
                    <li>
                        <a href="/ogretmen-profil-foto">Profil Resmini Güncelle</a>
                    </li>
                    <li>
                        <a href="/ogretmen-sifre-degistir">Şifremi Değiştir</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CounselorSettings;
