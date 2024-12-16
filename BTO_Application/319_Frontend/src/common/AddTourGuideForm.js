import React, { useState } from "react";
import axios from "axios"; // Add this import
import "./AddTourGuideForm.css";

const AddTourGuideForm = () => {
  const [formData, setFormData] = useState({
    BilkentID: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
    grade: "",
    iban: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { BilkentID, firstName, lastName, phoneNumber, department, grade, iban } = formData;

    try {
      // Define the request body
      const body = {
        email: BilkentID, // Assuming BilkentID is used as the email
        password: BilkentID, // Assuming the password is the same as BilkentID
        firstName,
        lastName,
        phoneNumber,
        department,
        grade: parseInt(grade), // Convert grade to integer
        iban,
        role: "TourGuide",
      };

      const token = localStorage.getItem("userToken"); // Retrieve the auth token (adjust as needed)
      if (!token) {
        alert("Authorization token missing. Please log in.");
        // Redirect to login page, e.g., window.location.href = '/login';
        return;
      }
      console.log("Retrieved Token:", token);

      // Send the POST request
      const response = await axios.post(
        "http://localhost:8081/api/tourguide/register",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the authorization header
          },
          withCredentials: true, // Include credentials like cookies
        }
      );

      console.log("Success:", response.data); // Log the response on success
      alert("Tur rehberi başarıyla eklendi!");

      // Reset form on success
      setFormData({
        BilkentID: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        department: "",
        grade: "",
        iban: "",
      });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error registering user. Please try again.");
    }
  };

  // Reset form
  const handleCancel = () => {
    setFormData({
      BilkentID: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      department: "",
      grade: "",
      iban: "",
    });
    console.log("Form reset");
  };

  return (
    <div className="add-tour-guide-form">
      <h2>Yeni Rehber Ekle</h2>
      <form onSubmit={handleSubmit}>
        {/* Bilkent ID */}
        <label>Bilkent ID</label>
        <input
          type="text"
          name="BilkentID"
          placeholder="Bilkent ID"
          value={formData.BilkentID}
          onChange={handleInputChange}
        />

        {/* First Name */}
        <label>Ad</label>
        <input
          type="text"
          name="firstName"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleInputChange}
        />

        {/* Last Name */}
        <label>Soyad</label>
        <input
          type="text"
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleInputChange}
        />

        {/* Phone Number */}
        <label>Telefon Numarası</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Telefon numarası"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />

        {/* Department */}
        <label>Bölüm</label>
        <input
          type="text"
          name="department"
          placeholder="Bölüm"
          value={formData.department}
          onChange={handleInputChange}
        />

        {/* Grade */}
        <label>Sınıf</label>
        <input
          type="number"
          name="grade"
          placeholder="Sınıf"
          value={formData.grade}
          onChange={handleInputChange}
        />

        {/* IBAN */}
        <label>IBAN</label>
        <input
          type="text"
          name="iban"
          placeholder="IBAN"
          value={formData.iban}
          onChange={handleInputChange}
        />

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="submit-button">
            Ekle
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTourGuideForm;
