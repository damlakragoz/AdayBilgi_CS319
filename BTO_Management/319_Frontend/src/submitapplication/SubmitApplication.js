import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API calls
import './SubmitApplication.css';

const SubmitApplication = () => {
    const [formData, setFormData] = useState({
        applicationDate: '',
        visitorCount: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        // Validate input data before submitting
        if (!formData.applicationDate || !formData.visitorCount) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            // Define the payload for the API request
            const payload = {
                tourApplication: {
                    requestedDate: formData.applicationDate,
                    visitorCount: parseInt(formData.visitorCount, 10),
                    status: 'pending', // Default status
                },
                counselorUsername: localStorage.getItem('username'), // Retrieve counselor username from localStorage
            };


            console.log('Payload:', payload); // Debugging payload
            console.log('Token from localStorage:', localStorage.getItem('userToken')); // Check token before the request
            console.log('Username from localStorage:', localStorage.getItem('username')); // Check username before the request


            // Make POST request to the backend endpoint
            const response = await axios.post(
                'http://localhost:8081/api/tour-applications/add',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Include token in header
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Ensures cookies and headers are included
                }
            );

            console.log('Response from backend:', response); // Debugging response

            // Handle successful response
            if (response.status === 201) {
                setSuccessMessage('Application submitted successfully!');
                setFormData({
                    applicationDate: '',
                    visitorCount: '',
                });
            }
        } catch (err) {
            // Handle errors
            if (err.response) {
                console.error('Response Error:', err.response); // Debugging server error response
                if (err.response.status === 401) {
                    setError('Unauthorized access. Please log in again.');
                    console.warn('Unauthorized access: Token might be invalid or expired');
                } else {
                    setError('Failed to submit application. Please try again.');
                }
            } else if (err.request) {
                console.error('Request Error:', err.request); // Debugging network errors
                setError('Network error. Please check your connection.');
            } else {
                console.error('Unexpected Error:', err.message); // Debugging unexpected errors
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="submit-application-container">
            <h2>Submit Tour Application</h2>
            <form className="application-form" onSubmit={handleSubmit}>
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
                    <label>Visitor Count</label>
                    <input
                        type="number"
                        name="visitorCount"
                        value={formData.visitorCount}
                        onChange={handleChange}
                        required
                        min="1" // Ensure at least 1 visitor
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Submit Application
                </button>
            </form>

            {/* Display success or error messages */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SubmitApplication;
