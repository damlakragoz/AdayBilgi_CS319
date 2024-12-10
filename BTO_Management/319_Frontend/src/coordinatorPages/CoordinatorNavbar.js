import React, { useState, useRef, useEffect } from 'react';
import './CoordinatorNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';


const CoordinatorNavbar = () => {
    const [isDropdown1Open, setDropdown1Open] = useState(false);
    const [isDropdown2Open, setDropdown2Open] = useState(false);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const navigate = useNavigate();

    // Close dropdown if click is outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
                setDropdown1Open(false);
            }
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setDropdown2Open(false);
            }
        };

        // Attach the click event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown1 = () => {
        setDropdown1Open(!isDropdown1Open);
    };

    const toggleDropdown2 = () => {
        setDropdown2Open(!isDropdown2Open);
    };

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <header className="navbar">
                <nav className="coord-navbar-links">
                    <ul>
                        {/* Onay Bekleyen İşlemler Dropdown */}
                        <li className="dropdown" ref={dropdownRef1}>
                            <button
                                onClick={toggleDropdown1}
                                className="dropdown-button"
                            >
                                Onay Bekleyen İşlemler <span>▼</span>
                            </button>
                            {isDropdown1Open && (
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/bto-koordinasyonu">
                                            BTO Koordinasyonu
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/fuar-davetleri">
                                            Fuar Davetleri
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/geribildirimler">
                                            Geribildirimler
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Yaklaşan Etkinlikler Dropdown */}
                        <li className="dropdown" ref={dropdownRef2}>
                            <button
                                onClick={toggleDropdown2}
                                className="dropdown-button"
                            >
                                Yaklaşan Etkinlikler <span>▼</span>
                            </button>
                            {isDropdown2Open && (
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/tur-takvimi">Tur Takvimi</Link>
                                    </li>
                                    <li>
                                        <Link to="/fuar-takvimi">Fuar Takvimi</Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Search Bar */}
                        <li className="search-bar">
                            <input
                                type="text"
                                placeholder="Sitede ara..."
                                className="search-input"
                            />
                            <button className="search-button">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </li>

                        {/* FontAwesome Icons */}
                        <li>
                            <Link to="/coordinator-homepage" className="icon">
                                <FontAwesomeIcon icon={faHome} style={{
                                   cursor: "pointer",
                                   marginLeft: "10px",
                                   color: "white",
                                 }}/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/notifications" className="icon">
                                <FontAwesomeIcon icon={faBell} style={{
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                  color: "white",
                                }}/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="icon" >
                                <FontAwesomeIcon icon={faUser} style={{
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                  color: "white",
                                }}/>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default CoordinatorNavbar;
