import React, { useState } from "react";
import axios from "axios";
import "./AddTourGuideForm.css";
import { useNavigate } from "react-router-dom";


const AddExecutiveForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input Validation: Ensure all fields are filled
    for (const key in formData) {
      if (!formData[key]) {
        alert("Lütfen tüm alanları doldurunuz! (" + key + " boş bırakıldı.)");
        return;
      }
    }

    const { email, firstName, lastName, phoneNumber } = formData;

    try {
      setIsLoading(true); // Set loading state to true when request is sent

      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        setIsLoading(false); // Reset loading state in case of error
        return;
      }

      const body = { email, firstName, lastName, phoneNumber };

      const response = await axios.post(
        "http://localhost:8081/api/executive/register", // Updated API endpoint
        body,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      console.log("Success:", response.data);
      alert("Yönetici başarıyla eklendi!");

      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
      setIsLoading(false); // Reset loading state after success
    } catch (error) {
      setIsLoading(false); // Reset loading state on error
      if (error.response && error.response.status === 400) {
        alert("Aynı e-mail adresine sahip bir kullanıcı bulunmaktadır.");
      } else {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert("Hata. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    console.log("Form reset");
  };

  return (
    <div className="add-tour-guide-form">
      <h2>Yeni Yönetici Ekle</h2>
      <form onSubmit={handleSubmit}>
        {/* Bilkent Email */}
        <label>Bilkent Email</label>
        <input
          type="email"
          name="email"
          placeholder="Bilkent Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        {/* First Name */}
        <label>Ad</label>
        <input
          type="text"
          name="firstName"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />

        {/* Last Name */}
        <label>Soyad</label>
        <input
          type="text"
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />

        {/* Phone Number */}
        <label>Telefon Numarası</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Telefon numarası"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Yükleniyor..." : "Ekle"}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>İptal</button>
        </div>
      </form>

      {/* Loading Screen (Overlay) */}
      {isLoading && (
        <div className="userform-loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default AddExecutiveForm;
