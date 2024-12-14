import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './SignUpForm.css';

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

    const navigate = useNavigate();  // Initialize useNavigate for programmatic navigation

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted', formData);
        // Navigate to the homepage after submitting the form
        navigate('/');
    };

    return (
        <div className="signup-container">
            <button className="back-button" onClick={() => navigate('/')}>Back</button> {/* Navigate to the home page */}

            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Aday Bilgi'ye Üye Ol</h2>
                <p>Akademik programlarımızı keşfetmek ve kişiselleştirilmiş kampüs turlarının keyfini çıkarmak için rehber öğretmen olarak kaydolun.</p>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="Enter your first name" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Enter your last name" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="highSchool" 
                        placeholder="Enter your high school" 
                        value={formData.highSchool} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        placeholder="Enter your phone number" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email address" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Create a password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm your password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="agreeToTerms" 
                        checked={formData.agreeToTerms} 
                        onChange={handleChange} 
                        required 
                    />
                    <label htmlFor="agreeToTerms">I agree to the terms and conditions</label>
                </div>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;
