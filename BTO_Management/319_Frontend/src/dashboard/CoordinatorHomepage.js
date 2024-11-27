import React from 'react';
import { Link } from 'react-router-dom';

const CoordinatorHomepage = () => {
    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <header className="navbar">
                <div className="navbar-logo">
                    <h2>Bilkent University</h2>
                </div>
                <nav className="navbar-links">
                    <ul>
                        <li>
                            <Link to="/kullanici-islemler">Kullanıcı İşlemleri</Link>
                        </li>
                        <li>
                            <Link to="/gosterge-paneli">Gösterge Paneli</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <div className="dashboard-content">
                <h1>Welcome to the Coordinator Dashboard</h1>
                <p>Choose an option from the menu above to manage users or view the dashboard.</p>
            </div>
        </div>
    );
};

export default CoordinatorHomepage;
