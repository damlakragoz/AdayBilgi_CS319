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
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@bilkent\.edu\.tr$/; // Validate Bilkent email
    const ibanRegex = /^[A-Z0-9]{16,34}$/; // Basic IBAN format (adjust if needed)
    const phoneRegex = /^[0-9]+$/; // Ensure only numeric values


    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Geçerli bir Bilkent e-mail adresi girin (Örneğin: example@bilkent.edu.tr).";
    }
    if (!formData.firstName) {
      newErrors.firstName = "Ad alanı boş bırakılamaz.";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Soyad alanı boş bırakılamaz.";
    }
    if (!phoneRegex.test(formData.phoneNumber) || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Geçerli bir telefon numarası girin (en az 10 haneli).";
    }
    if (!formData.department) {
      newErrors.department = "Lütfen bir bölüm seçin.";
    }
    if (!formData.grade || formData.grade < 1 || formData.grade > 4) {
      newErrors.grade = "Sınıf 1 ile 4 arasında olmalıdır.";
    }
    if (!ibanRegex.test(formData.iban)) {
      newErrors.iban = "Geçerli bir IBAN girin.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
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

    if (validateForm()) {
      console.log("Form Submitted:", formData);
      // Perform further actions like API call
    }

    setLoading(true); // Show loading screen

    const { email, firstName, lastName, phoneNumber, department, grade, iban } = formData;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Yetkilendirme eksik. Lütfen tekrar giriş yapınız.");
        setLoading(false);
        return;
      }

      const body = {
        ...formData,
        grade: parseInt(formData.grade, 10),
      };

      const response = await axios.post(
          "http://localhost:8081/api/tourguide/register",
          body,
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
      if (error.response && error.response.status === 400) {
        toast.error("Bu e-mail adresine sahip bir tur rehberi bulunmaktadır!");
      } else {
        console.error("Error:", error);
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
       setLoading(false); // Hide loading screen
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
              required
            />

            {/* First Name */}
            <label>Ad</label>
            <input
              type="text"
              name="firstName"
              placeholder="Adınızı giriniz."
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />

            {/* Last Name */}
            <label>Soyad</label>
            <input
              type="text"
              name="lastName"
              placeholder="Soyadınızı giriniz."
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />

            {/* Phone Number */}
            <label>Telefon Numarası</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="0 (5xx) xxx xxxx"
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
                <option key={dept} value={dept}>
                  {dept}
                </option>
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
              placeholder="IBAN numaranızı giriniz."
              value={formData.iban}
              onChange={handleInputChange}
              required
            />

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
