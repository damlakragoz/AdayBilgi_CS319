import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IndividualApplicationPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IndividualApplicationPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        highSchool: "",
        phoneNumber: "",
        email: "",
        visitors: "",
        additionalRequests: "",
        selectedDates: [],
    });

    const [highSchools, setHighSchools] = useState([]); // Dynamic high school list from the database
    const [filteredHighSchools, setFilteredHighSchools] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const timeSlots = [
        { id: "SLOT_9_10", displayName: "09:00-10:00" },
        { id: "SLOT_10_11", displayName: "10:00-11:00" },
        { id: "SLOT_11_12", displayName: "11:00-12:00" },
        { id: "SLOT_13_14", displayName: "13:00-14:00" },
        { id: "SLOT_14_15", displayName: "14:00-15:00" },
    ];

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Flag to prevent double fetching
        const fetchHighSchools = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8081/api/school/getAll"
                );
                if (response.status === 200 && isMounted) {
                    setHighSchools(response.data);
                    setFilteredHighSchools(response.data); // Initial filtering
                } else if (isMounted) {
                    toast.error("Liseler veritabanından alınamadı.");
                }
            } catch (error) {
                console.error("Liseler veritabanından alınamadı: ", error.message);
                if (isMounted) {
                    toast.error("Liseler veritabanından alınamadı.");
                }
            }
        };

        fetchHighSchools();

        return () => {
            isMounted = false; // Cleanup function to prevent double execution
        };
    }, []);


    // Close dropdown when clicking outside
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'highSchool') {
            if (value && value.trim() !== '') {
                const searchValue = value.toLowerCase();
                const filtered = highSchools.filter((school) =>
                    school?.schoolName?.toLowerCase().includes(searchValue)
                );
                setFilteredHighSchools(filtered);
                setShowDropdown(filtered.length > 0); // Show dropdown only if there are filtered results
            } else {
                setFilteredHighSchools([]); // Clear dropdown results
                setShowDropdown(false);
            }
        }
        console.log("High Schools:", highSchools);
        console.log("Filtered High Schools:", filteredHighSchools);
        console.log("Show Dropdown:", showDropdown);

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
                selectedDates: [...formData.selectedDates, { date: "", timeSlot: "" }],
            });
        } else {
            toast.warn("En fazla 3 tarih-saat aralığı seçebilirsiniz.");
        }
    };

    const removeDateTimeField = (index) => {
        const updatedDates = formData.selectedDates.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            selectedDates: updatedDates,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            individualTourApplication: {
                applicantName: formData.firstName,
                applicantSurname: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                visitorCount: formData.visitors,
                extraInformation: formData.additionalRequests,
            },
            schoolName: formData.highSchool,
            requestedDates: formData.selectedDates.map((dt) => ({
                date: dt.date,
                timeSlot: dt.timeSlot,
            })),
        };

        try {
            const response = await axios.post(
                "http://localhost:8081/api/tour-applications/add/individual-application",
                payload
            );
            if (response.status === 201 || response.status === 200) {
                toast.success("Başvuru başarıyla gönderildi!");
                navigate("/");
            } else {
                toast.error("Başvuru gönderilemedi.");
            }
        } catch (error) {
            console.error("Başvuru gönderilirken hata oluştu:", error.message);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };


    return (
        <div className="application-container">
            <button className="back-button" onClick={() => navigate("/")}>
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
                        {showDropdown && filteredHighSchools.length > 0 && (
                            <ul className="dropdown">
                                {filteredHighSchools.map((school, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelect(school.schoolName)}
                                        className="dropdown-item"
                                    >
                                        {school.schoolName}
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
                    <div className="date-time-container">
                        {formData.selectedDates.map((dateTime, index) => (
                            <div key={index} className="date-time-row">
                                <label>{index + 1}. Tercih Edilen Tarih ve Saat</label>
                                <input
                                    type="date"
                                    value={dateTime.date}
                                    onChange={(e) =>
                                        handleDateTimeChange(index, "date", e.target.value)
                                    }
                                    required
                                />
                                <select
                                    value={dateTime.timeSlot}
                                    onChange={(e) =>
                                        handleDateTimeChange(index, "timeSlot", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Saat Seçiniz</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.id} value={slot.id}>
                                            {slot.displayName}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="remove-date-time-btn"
                                    onClick={() => removeDateTimeField(index)}
                                >
                                    X
                                </button>
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
                        Başvur
                    </button>
                </form>
            </div>
            <div className="info-section">
                <h3>ÖNEMLİ BİLGİLENDİRME</h3>
                <p>
                    Lütfen liseler için tur başvurusu yapabilmek için{" "}
                    <span className="highlight">rehber öğretmen hesabınıza</span> giriş
                    yaptığınızdan emin olun.
                </p>
                <p>
                    Eğer bir hesabınız yoksa{" "}
                    <span className="link" onClick={() => navigate("/signup")}>
            kayıt olmak için tıklayın
          </span>
                    .
                </p>
            </div>
        </div>
    );
};

export default IndividualApplicationPage;
