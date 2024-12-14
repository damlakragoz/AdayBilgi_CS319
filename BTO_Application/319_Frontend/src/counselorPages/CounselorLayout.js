import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import CounselorHeader from './CounselorHeader';
import Sidebar from './CounselorSidebar';

const CounselorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const location = useLocation(); // Get the current location (URL)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    useEffect(() => {
        // Any additional side effects based on route change can go here
    }, [location]);

    return (
        <div className="coordinator-layout">
            <CounselorHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? 'with-sidebar' : ''
                    }`}
                >
                    {/* Dynamic content will be rendered here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CounselorLayout;
