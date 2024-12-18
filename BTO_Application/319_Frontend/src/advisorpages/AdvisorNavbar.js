import React, { useState, useRef, useEffect } from 'react';
import './AdvisorNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';

const AdvisorNavbar = () => {
    const [isDropdown1Open, setDropdown1Open] = useState(false);
    const [isDropdown2Open, setDropdown2Open] = useState(false);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
                setDropdown1Open(false);
            }
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setDropdown2Open(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown1 = () => setDropdown1Open(!isDropdown1Open);
    const toggleDropdown2 = () => setDropdown2Open(!isDropdown2Open);

    return (
        <div className="dashboard-container">
            <header className="navbar">
                <nav className="advisor-navbar-links">
                    <ul>
                        <li className="dropdown" ref={dropdownRef1}>
                            <button onClick={toggleDropdown1} className="dropdown-button">
                                Kullanıcı İşlemleri <span>▼</span>
                            </button>
                            {isDropdown1Open && (
                                <ul className="dropdown-menu">
                                    <li><Link to="/advisor-tourenrollment">Başvur-Tur Takvimi</Link></li>
                                    <li><Link to="/advisor-puantage">Puantaj-Aktivite Giriş</Link></li>
                                </ul>
                            )}
                        </li>

                        <li className="dropdown" ref={dropdownRef2}>
                            <button onClick={toggleDropdown2} className="dropdown-button">
                                Gösterge Paneli <span>▼</span>
                            </button>
                            {isDropdown2Open && (
                                <ul className="dropdown-menu">
                                    <li><Link to="/odeme-bilgileri">Ödeme Bilgileri</Link></li>
                                    <li><Link to="/kayit-olunan-aktiviteler">Kayıt Olunan Aktiviteler</Link></li>
                                </ul>
                            )}
                        </li>

                        <li className="search-bar">
                            <input type="text" placeholder="Sitede ara..." className="search-input" />
                            <button className="search-button">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </li>

                        <li><Link to="/advisor-homepage" className="icon"><FontAwesomeIcon icon={faHome} /></Link></li>
                        <li><Link to="/notifications" className="icon"><FontAwesomeIcon icon={faBell} /></Link></li>
                        <li><Link to="/profile" className="icon"><FontAwesomeIcon icon={faUser} /></Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default AdvisorNavbar;
