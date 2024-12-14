// ApplicationTable.js
import React from 'react';
import './ApplicationTable.css';

const ApplicationTable = () => {
    return (
        <div className="application-section">
            <h2>Tur Başvurularım</h2>
            <table className="application-table">
                <thead>
                    <tr>
                        <th>Durum</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Onay Bekleniyor</td>
                        <td>25.08.2024</td>
                        <td>15:30-16:20</td>
                    </tr>
                    <tr>
                        <td>Onaylandı</td>
                        <td>25.08.2024</td>
                        <td>15:30-16:20</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
            <button className="manage-btn">Manage Applications</button>
            <div className="pagination">
                <span>&laquo;</span>
                <span>&lt;</span>
                <span>&gt;</span>
                <span>&raquo;</span>
            </div>
        </div>
    );
};

export default ApplicationTable;
