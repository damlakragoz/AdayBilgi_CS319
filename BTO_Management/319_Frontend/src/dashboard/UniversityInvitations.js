// UniversityInvitations.js
import React from 'react';
import './UniversityInvitations.css';

const UniversityInvitations = () => {
    return (
        <div className="invitation-section">
            <h2>Universite Fuari Davetlerim</h2>
            <table className="invitation-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Waiting for approval</td>
                        <td>25.08.2024</td>
                        <td>Row item</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
            <button className="manage-btn">Manage Invitations</button>
            <div className="pagination">
                <span>&laquo;</span>
                <span>&lt;</span>
                <span>&gt;</span>
                <span>&raquo;</span>
            </div>
        </div>
    );
};

export default UniversityInvitations;
