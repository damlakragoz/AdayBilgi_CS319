import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.css";

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        highSchool: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        selectedDates: [{ date: "", timeSlot: "" }], // Array for multiple date-time selections
    });

    const [highSchools] = useState([
        "High School A",
        "High School B",
        "High School C",
        "High School D",
    ]);
    const [filteredHighSchools, setFilteredHighSchools] = useState(highSchools);
    const [showDropdown, setShowDropdown] = useState(false);
    const [timeSlots] = useState([
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
    ]);

    const dropdownRef = useRef(null); // Ref for handling outside clicks
    const navigate = useNavigate();

    // Handle outside clicks to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        if (name === "highSchool") {
            const filtered = highSchools.filter((school) =>
                school.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredHighSchools(filtered);
            setShowDropdown(true); // Show the dropdown when typing
        }
    };

    const handleSelect = (value) => {
        setFormData({
            ...formData,
            highSchool: value,
        });
        setShowDropdown(false); // Close the dropdown
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        navigate("/");
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <button className="back-button" onClick={() => navigate("/")}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2>Aday Bilgi'ye Üye Ol</h2>
                <p>
                    Akademik programlarımızı keşfetmek ve kişiselleştirilmiş kampüs turlarının
                    keyfini çıkarmak için rehber öğretmen olarak kaydolun.
                </p>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Adınızı girin"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Soyadınızı girin"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group combo-box" ref={dropdownRef}>
                        <input
                            type="text"
                            name="highSchool"
                            placeholder="Lisenizi seçiniz veya yazınız"
                            value={formData.highSchool}
                            onChange={handleChange}
                            onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                            required
                        />
                        {showDropdown && formData.highSchool && filteredHighSchools.length > 0 && (
                            <ul className="dropdown">
                                {filteredHighSchools.map((school, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelect(school)}
                                        className="dropdown-item"
                                    >
                                        {school}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Telefon numaranızı girin"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-posta adresinizi girin"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="agreeToTerms">
                            Şartlar ve koşulları kabul ediyorum
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">
                        Kayıt Ol
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
