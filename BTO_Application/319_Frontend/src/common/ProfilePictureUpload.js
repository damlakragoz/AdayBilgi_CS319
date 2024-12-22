import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePictureUpload.css";

const ProfilePictureUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Use navigate for redirection

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png"];
        if (file && allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
            setFile(file);
        } else {
            toast.error("Lütfen geçerli bir resim dosyası yükleyin (JPEG/PNG, maksimum 10MB).");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Lütfen bir dosya seçin ve tekrar deneyin.");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");
            const username = localStorage.getItem("username");
            if (!token || !username) {
                toast.error("Lütfen yeniden giriş yapınız.");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("username", username);

            await axios.post("http://localhost:8081/api/profile/upload-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Profil resmi başarıyla yüklendi!");
        } catch (error) {
            toast.error("Yükleme başarısız. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="upload-container">
            <h1>Profil Resmi Yükle</h1>
            <input type="file" className="file-input" onChange={handleFileChange} />
            <button className="upload-button" onClick={handleUpload}>
                Yükle
            </button>
        </div>
    );
};

export default ProfilePictureUpload;
