import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdvisorHeader from './AdvisorHeader';
import AdvisorSidebar from './AdvisorSidebar';

const AdvisorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="advisor-layout">
            <AdvisorHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <AdvisorSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`content-container flex-grow-1 ${sidebarOpen ? 'with-sidebar' : ''}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdvisorLayout;
