import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import CoordinatorHeader from './CoordinatorHeader';
import Sidebar from './CoordinatorSidebar';
import CoordinatorSidebar from "./CoordinatorSidebar";

const CoordinatorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    return (
        <div className="coordinator-layout">
            <CoordinatorHeader toggleSidebar={toggleSidebar}/>
            <div className="d-flex">
                <CoordinatorSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                <div className={`content-container flex-grow-1 ${sidebarOpen ? 'with-sidebar' : ''}`}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorLayout;
