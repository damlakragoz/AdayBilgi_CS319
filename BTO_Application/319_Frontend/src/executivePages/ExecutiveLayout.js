import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import ExecutiveHeader from './ExecutiveHeader';
import ExecutiveSidebar from './ExecutiveSidebar';

const ExecutiveLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const location = useLocation(); // Get the current location (URL)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    useEffect(() => {
        // Any additional side effects based on route change can go here
    }, [location]);

    return (
        <div className="executive-layout">
            <ExecutiveHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <ExecutiveSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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

export default ExecutiveLayout;
