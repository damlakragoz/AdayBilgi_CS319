// SubmitApplication.js
import React, { useState, useEffect } from 'react';
import './SubmitApplication.css';

const SubmitApplication = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        applicationDate: '',
        applicationDetails: '',
    });

     // Use useEffect to retrieve the email from localStorage when the component loads
     useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: storedEmail,  // Pre-fill email field with the stored email
            }));
        }
    }, []);  // Empty dependency array to run only once when component mounts

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Application submitted:', formData);
        // Here, you would typically send the form data to the server
    };

    return (
        <div className="submit-application-container">
            <h2>Submit Tour Application</h2>
            <form className="application-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}// This field will be pre-filled
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Application Date</label>
                    <input
                        type="date"
                        name="applicationDate"
                        value={formData.applicationDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Application Details</label>
                    <textarea
                        name="applicationDetails"
                        value={formData.applicationDetails}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default SubmitApplication;
