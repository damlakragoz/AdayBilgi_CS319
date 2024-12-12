import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewFeedback.css';

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch feedback data when the component mounts
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('/api/feedback'); // Replace with your backend endpoint
                setFeedbacks(response.data);
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
                setError('Could not fetch feedbacks. Please try again later.');
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="view-feedback-page">
            <h1>Feedback List</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="feedback-list">
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <div key={feedback.id} className="feedback-card">
                            <h3>Tour: {feedback.tour ? feedback.tour.name : 'N/A'}</h3>
                            <p>Rating: {feedback.rating} ★</p>
                            <p>Comment: {feedback.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No feedbacks available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewFeedback;
