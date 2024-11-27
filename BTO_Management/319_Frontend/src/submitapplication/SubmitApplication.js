import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API calls
import './SubmitApplication.css';

const SubmitApplication = () => {
    const [formData, setFormData] = useState({
        applicationDates: [],
        applicationDate: '', // Temporary storage for the selected date
        visitorCount: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddDate = () => {
        if (!formData.applicationDate) {
            setError('Please select a valid date.');
            return;
        }
        if (formData.applicationDates.includes(formData.applicationDate)) {
            setError('Date already added.');
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            applicationDates: [...prevData.applicationDates, formData.applicationDate],
            applicationDate: '', // Clear the temporary date after adding
        }));
        setError(''); // Clear error if successful
    };

    const handleRemoveDate = (dateToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            applicationDates: prevData.applicationDates.filter((date) => date !== dateToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        // Validate input data before submitting
        if (formData.applicationDates.length === 0 || !formData.visitorCount) {
            setError('Please fill out all fields and add at least one date.');
            return;
        }

        try {
            // Define the payload for the API request
            const payload = {
                tourApplication: {
                    requestedDates: formData.applicationDates,
                    visitorCount: parseInt(formData.visitorCount, 10),
                    status: 'pending', // Default status
                },
                counselorUsername: localStorage.getItem('username'), // Retrieve counselor username from localStorage
            };

            console.log('Payload:', payload); // Debugging payload

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

            // Handle successful response
            if (response.status === 201) {
                setSuccessMessage('Application submitted successfully!');
                setFormData({
                    applicationDates: [],
                    applicationDate: '',
                    visitorCount: '',
                });
            }
        } catch (err) {
            // Handle errors
            if (err.response) {
                setError(err.response.data?.message || 'Failed to submit application. Please try again.');
            } else {
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
                        value={formData.applicationDate} // Controlled input for the temporary date
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={handleAddDate}
                    >
                        Add Date
                    </button>
                </div>
                {/* Display the list of added dates */}
                <div className="dates-list">
                    <h4>Added Dates:</h4>
                    {formData.applicationDates.map((date, index) => (
                        <div key={index} className="date-item">
                            <span>{date}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveDate(date)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
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
