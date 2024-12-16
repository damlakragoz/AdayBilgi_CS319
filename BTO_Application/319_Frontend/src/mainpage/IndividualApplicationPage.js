import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualApplicationPage.css';

const IndividualApplicationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        highSchool: '',
        phoneNumber: '',
        email: '',
        visitors: '',
        additionalRequests: '',
        selectedDates: [], // Initialize as an empty array
    });

    const [highSchools] = useState([
        'High School A',
        'High School B',
        'High School C',
        'High School D',
    ]);

    const [timeSlots] = useState([
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
    ]);

    const [filteredHighSchools, setFilteredHighSchools] = useState(highSchools);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'highSchool') {
            const filtered = highSchools.filter((school) =>
                school.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredHighSchools(filtered);
            setShowDropdown(true);
        }
    };

    const handleSelect = (value) => {
        setFormData({
            ...formData,
            highSchool: value,
        });
        setShowDropdown(false);
    };

    const handleDateTimeChange = (index, field, value) => {
        const updatedDates = [...formData.selectedDates];
        updatedDates[index][field] = value;
        setFormData({
            ...formData,
            selectedDates: updatedDates,
        });
    };

    const addDateTimeField = () => {
        if (formData.selectedDates.length < 3) {
            setFormData({
                ...formData,
                selectedDates: [...formData.selectedDates, { date: '', timeSlot: '' }],
            });
        }
    };

    const removeDateTimeField = (index) => {
        const updatedDates = formData.selectedDates.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            selectedDates: updatedDates,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="application-container">
            <button className="back-button" onClick={() => navigate('/')}>
                <i className="fas fa-arrow-left"></i>
            </button>
            <div className="form-section">
                <h2>Özel Kampüs Turu Başvuru Formu</h2>
                <form className="application-form" onSubmit={handleSubmit}>
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
                            onFocus={() => setShowDropdown(true)}
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
                    <div className="form-group">
                        {formData.selectedDates.map((dateTime, index) => (
                            <div key={index} className="date-time-group">
                                <label>{index + 1}. Tur Zamanı Tercihim</label>
                                <input
                                    type="date"
                                    name={`date-${index}`}
                                    value={dateTime.date}
                                    onChange={(e) => handleDateTimeChange(index, 'date', e.target.value)}
                                    required
                                />
                                <select
                                    name={`timeSlot-${index}`}
                                    value={dateTime.timeSlot}
                                    onChange={(e) => handleDateTimeChange(index, 'timeSlot', e.target.value)}
                                    required
                                >
                                    <option value="">Saat Seçiniz</option>
                                    {timeSlots.map((slot, idx) => (
                                        <option key={idx} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                {formData.selectedDates.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-date-time-btn"
                                        onClick={() => removeDateTimeField(index)}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.selectedDates.length < 3 && (
                            <button
                                type="button"
                                className="add-date-time-btn"
                                onClick={addDateTimeField}
                            >
                                + Tarih ve Saat Ekle
                            </button>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            name="visitors"
                            placeholder="Ziyaretçi Sayısı"
                            value={formData.visitors}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="additionalRequests"
                            placeholder="Özel bir isteğiniz var mı?"
                            value={formData.additionalRequests}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Gönder
                    </button>
                </form>
            </div>
            <div className="info-section">
                <h3>ÖNEMLİ BİLGİLENDİRME</h3>
                <p>
                    Lütfen liseler için tur başvurusu yapabilmek için{' '}
                    <span className="highlight">rehber öğretmen hesabınıza</span> giriş
                    yaptığınızdan emin olun.
                </p>
                <p>
                    Eğer bir hesabınız yoksa{' '}
                    <span
                        className="link"
                        onClick={() => navigate('/signup')}
                    >
                        kayıt olmak için tıklayın
                    </span>.
                </p>
            </div>
        </div>
    );
};

export default IndividualApplicationPage;
