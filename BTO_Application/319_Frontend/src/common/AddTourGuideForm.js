import React, { useState } from "react";
import axios from "axios";
import "./AddTourGuideForm.css";

const departments = [
  "AMER", "ARCH", "ARKEO", "COMD", "CS", "CTIS", "EE", "EDU", "ELIT", "ES", "FA",
  "GRA", "HIST", "ECON", "IAED", "IE", "IR", "LAUD", "MAN", "MATEFL", "ME", "PHIL",
  "POLS", "PSY", "TEACHED", "THM", "TRIN", "TURKISHLIT"
].sort();

const AddTourGuideForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
    grade: 1, // Default grade to 1
    iban: "",
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
        alert("Lütfen tüm alanları doldurunuz! (" + key + " boş bırakıldı)");
        return;
      }
    }

    const { email, firstName, lastName, phoneNumber, department, grade, iban } = formData;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        return;
      }

      const body = { email, firstName, lastName, phoneNumber, department, grade: parseInt(grade), iban };

      const response = await axios.post(
          "http://localhost:8081/api/tourguide/register",
          body,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      console.log("Success:", response.data);
      alert("Tur rehberi başarıyla eklendi!");

      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        department: "",
        grade: 1, // Reset grade to 1
        iban: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Show popup if user already exists
        alert("Aynı Email Adresine Sahip Bir Tur Rehberi Daha Var!");
      } else {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert("Error registering user. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      department: "",
      grade: 1, // Reset grade to 1
      iban: "",
    });
    console.log("Form reset");
  };

  return (
      <div className="add-tour-guide-form">
        <h2>Yeni Rehber Ekle</h2>
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

          {/* Department */}
          <label>Bölüm</label>
          <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
          >
            <option value="" disabled>Bölüm Seçiniz</option>
            {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Grade */}
          <label>Sınıf</label>
          <input
              type="number"
              name="grade"
              placeholder="Sınıf (1-4)"
              value={formData.grade}
              onChange={handleInputChange}
              min="1"
              max="4"
              required
          />

          {/* IBAN */}
          <label>IBAN</label>
          <input
              type="text"
              name="iban"
              placeholder="IBAN"
              value={formData.iban}
              onChange={handleInputChange}
              required
          />

          {/* Buttons */}
          <div className="button-group">
            <button type="submit" className="submit-button">Ekle</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>İptal</button>
          </div>
        </form>
      </div>
  );
};

export default AddTourGuideForm;
