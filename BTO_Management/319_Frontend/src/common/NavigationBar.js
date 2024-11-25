// NavigationBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear tokens and user-related data
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        sessionStorage.removeItem('userToken'); // Just in case

        // Navigate to login page
        navigate('/');
    };

    return (
        <div className="navbar">
            <ul className="nav-links">
                <li className="dropdown">
                    <a href="#!" className="dropbtn">Tour Applications</a>
                    <div className="dropdown-content">
                        <a href="#!" onClick={() => navigate('/submit-application')}>Submit Application</a>
                        <a href="#!">My Applications</a>
                        <a href="#!">Modify Applications</a>
                    </div>
                </li>
                <li className="dropdown">
                    <a href="#!" className="dropbtn">University Fairs</a>
                    <div className="dropdown-content">
                        <a href="#!">Submit Fair Invitation</a>
                        <a href="#!">My Invitations</a>
                    </div>
                </li>

            </ul>
            <input type="text" className="search-bar" placeholder="Sitede ara..." />
            <div className="icons">
                <span className="icon-bell">&#128276;</span>
                <span className="icon-user">&#128100;</span>
            </div>
            {/* Add Logout Button */}
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default NavigationBar;
