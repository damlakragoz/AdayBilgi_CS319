import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProfilePictureDisplay.css';

const ProfilePictureDisplay = () => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const username = localStorage.getItem("username");
                const response = await axios.get(`http://localhost:8081/api/profile/get-picture`, {
                    params: { username },
                    responseType: "arraybuffer",
                });

                const blob = new Blob([response.data], { type: "image/jpeg" });
                const url = URL.createObjectURL(blob);
                setImage(url);
            } catch (error) {
                console.error("Failed to fetch profile picture:", error);
            }
        };

        fetchProfilePicture();
    }, []);

    return (
        <div className="display-container">
            <h1>Profil Resmi</h1>
            {image ? (
                <img src={image} alt="Profile" className="profile-picture" />
            ) : (
                <p>Henüz profil resmi yüklenmedi.</p>
            )}
        </div>
    );
};

export default ProfilePictureDisplay;
