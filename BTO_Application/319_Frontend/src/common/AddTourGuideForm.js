import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTourGuideForm.css";
import { useNavigate } from "react-router-dom";

const departments = [
  "AMER", "ARCH", "COMD", "CS", "CTIS", "EE", "EDU", "ELIT", "FA",
  "GRA", "HIST", "ECON", "HART", "IAED", "IE", "IR", "LAUD", "MAN", "ME", "PHIL",
  "POLS", "PSYC", "THM", "TRIN"
].sort();

const AddTourGuideForm = () => {
    const [errorMessages, setErrorMessages] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
    grade: 1, // Default grade to 1
    iban: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {}; // Map field names to errors

    // Validate email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Geçerli bir e-mail adresi giriniz.";
    }

    // Validate first name
    if (!formData.firstName) {
      errors.firstName = "Ad alanı boş olamaz.";
    }

    // Validate last name
    if (!formData.lastName) {
      errors.lastName = "Soyad alanı boş olamaz.";
    }

    // Validate phone number
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Telefon numarası geçersiz. Lütfen 10 haneli bir telefon numarası giriniz.";
    }

    // Validate department
    if (!formData.department) {
      errors.department = "Bölüm alanı boş olamaz.";
    }

    // Validate grade (ensure it is a number)
    if (!formData.grade || isNaN(formData.grade)) {
      errors.grade = "Sınıf geçersiz. Lütfen geçerli bir sınıf giriniz.";
    }

    // Validate IBAN
    if (!formData.iban || formData.iban.length !== 26) {
      errors.iban = "IBAN numarası geçersiz. Lütfen 26 haneli bir IBAN giriniz.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Lütfen tüm alanları doğru şekilde doldurun!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Yetkilendirme eksik. Lütfen tekrar giriş yapınız.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
          "http://localhost:8081/api/tourguide/register",
          { ...formData, grade: parseInt(formData.grade, 10) },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Tur rehberi başarıyla eklendi!");
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
      if (error.response?.status === 400) {
        toast.error("Bu e-mail adresine sahip bir tur rehberi bulunmaktadır!");
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
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
    navigate(-1);
  };

  return (
    <div className="add-tour-guide-form">
      <div>
        <h2>Yeni Rehber Ekle</h2>
        <form onSubmit={handleSubmit}>
          {/* Bilkent Email */}
          <label>Bilkent E-mail</label>
          <input
              type="email"
              name="email"
              placeholder="example@ug.bilkent.edu.tr"
              value={formData.email}
              onChange={handleInputChange}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}

          {/* First Name */}
          <label>Ad</label>
          <input
              type="text"
              name="firstName"
              placeholder="Adınızı giriniz."
              value={formData.firstName}
              onChange={handleInputChange}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}

          {/* Last Name */}
          <label>Soyad</label>
          <input
              type="text"
              name="lastName"
              placeholder="Soyadınızı giriniz."
              value={formData.lastName}
              onChange={handleInputChange}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}

          {/* Phone Number */}
          <label>Telefon Numarası</label>
          <input
              type="tel"
              name="phoneNumber"
              placeholder="(5xx)xxxxxxx"
              value={formData.phoneNumber}
              onChange={handleInputChange}
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}

          {/* Department */}
          <label>Bölüm</label>
          <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
          >
            <option value="" disabled>Bölüm Seçiniz</option>
            {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error-message">{errors.department}</span>}

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
          />
          {errors.grade && <span className="error-message">{errors.grade}</span>}

          {/* IBAN */}
          <label>IBAN</label>
          <input
              type="text"
              name="iban"
              placeholder="IBAN numaranızı giriniz."
              value={formData.iban}
              onChange={handleInputChange}
          />
          {errors.iban && <span className="error-message">{errors.iban}</span>}

          {/* Buttons */}
          <div className="button-group">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              İptal
            </button>
            <button type="submit" className="submit-button">
              Ekle
            </button>
          </div>
        </form>

        {/* Loading Screen (Overlay) */}
        {loading && (
            <div className="userform-loading-screen">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
        )}
      </div>
    </div>
  );

};

export default AddTourGuideForm;
