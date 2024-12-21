import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        highSchool: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [schools, setSchools] = useState([]);  // State for schools
    const navigate = useNavigate();
    const [toastId, setToastId] = useState(null);


    useEffect(() => {
        // Display toast notification if not already shown
        if (!toast.isActive(toastId)) {
            const id = toast.info(
                'Bu sayfa yalnızca rehber öğretmenler içindir. Lütfen kaydolmadan önce rehber öğretmen olduğunuzdan emin olun.',
                {
                    autoClose: 5000,
                    closeOnClick: true,
                    draggable: true,
                }
            );
            setToastId(id); // Store the toast ID
        }
        // Fetch schools from the API on component mount
        const fetchSchools = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/school/getAll');
                setSchools(response.data);  // Assuming response.data contains the list of schools
            } catch (error) {
                console.error('Okullar yüklenirken hata oluştu:', error);
                toast.error('Okullar yüklenemedi. Lütfen daha sonra tekrar deneyin.');
            }
        };

        fetchSchools();
        // Cleanup toast on unmount or navigation
        return () => {
            toast.dismiss(toastId);
        };
    }, [toastId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, highSchool, phoneNumber, email, password, confirmPassword } = formData;

        if (password.length < 8) {
            toast.error('Şifre en az 8 karakter olmalıdır!');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor! Lütfen girdiğiniz şifreleri kontrol edin.');
            return;
        }

        const body = {
            firstName,
            lastName,
            schoolName: highSchool,
            phoneNumber,
            email,
            password,
            role: 'Counselor', // Changed role to Turkish
        };

        try {
            const response = await axios.post('http://localhost:8081/api/counselor/register', body);
            toast.success('Başarıyla kaydoldunuz! Giriş sayfasına yönlendiriliyorsunuz.', { position: 'top-center' });

            setFormData({
                firstName: '',
                lastName: '',
                highSchool: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeToTerms: false
            });

            navigate('/login');
        } catch (error) {
            console.error('Başvuru hatası:', error.response?.data || error.message);
            toast.error(`Hata: ${error.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.'}`, { position: 'top-center' });
        }
    };

    return (
        <div className="signup-container">
            <button className="back-button" onClick={() => navigate('/')}>Geri</button>

            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Aday Bilgi'ye Üye Ol</h2>
                <p>Akademik programlarımızı keşfetmek ve kişiselleştirilmiş kampüs turlarının keyfini çıkarmak için
                    rehber öğretmen olarak kaydolun.</p>

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

                {/* Fixed dropdown for selecting the high school */}
                <div className="form-group">
                    <select
                        name="highSchool"
                        value={formData.highSchool}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Bir okul seçin</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.schoolName}>
                                {school.schoolName}
                            </option>
                        ))}
                    </select>
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
                    <input
                        type="password"
                        name="password"
                        placeholder="Şifre oluşturun"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Şifrenizi doğrulayın"
                        value={formData.confirmPassword}
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
                    <label htmlFor="agreeToTerms">Şartlar ve koşulları kabul ediyorum</label>
                </div>

                <button type="submit" className="submit-btn">Üye Ol</button>
            </form>
        </div>
    );
};

export default SignUpForm;
