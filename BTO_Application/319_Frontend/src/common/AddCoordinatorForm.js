import React, { useState } from "react";
import axios from "axios";
import "./AddTourGuideForm.css";

const AddCoordinatorForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

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

    const { email, firstName, lastName, phoneNumber} = formData;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        return;
      }

      const body = { email, firstName, lastName, phoneNumber };

      const response = await axios.post(
        "http://localhost:8081/api/executive/register", // Update API endpoint
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
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Aynı e-mail adresine sahip bir yönetici daha var!");
      } else {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert("Error registering coordinator. Please try again.");
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
      <h2>Yeni Koordinatör Ekle</h2>
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
          <button type="submit" className="submit-button" >Ekle</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>İptal</button>
        </div>
      </form>
    </div>
  );
};

export default AddCoordinatorForm;
