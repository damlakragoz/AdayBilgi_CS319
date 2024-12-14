// CoordinatorHomepage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoordinatorNavbar from './CoordinatorNavbar';
import CoordinatorHeader from './CoordinatorHeader';
import OnayBekleyen from './OnayBekleyen';
import CounselorList from '../common/CounselorList';
import Sidebar from './CoordinatorSidebar';

const CoordinatorHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    useEffect(() => {
        // Clear tokens or perform other side effects
    }, []);
    return (
        <div className="coordinator-homepage">

            <CoordinatorHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? "with-sidebar" : ""
                    }`}
                >
                    {/* Main content */}
                </div>
            </div>

            <h1>Welcome to the Coordinator Homepage</h1>
            <p>This is an empty page for now.</p>
            <OnayBekleyen/>
        </div>
    );
};

export default CoordinatorHomepage;
