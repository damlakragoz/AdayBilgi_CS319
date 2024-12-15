import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TourGuideHeader from './TourGuideHeader';
import TourGuideSidebar from './TourGuideSidebar';

const TourGuideHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    return (
        <div className="tour-guide-homepage">

                    {/* Placeholder content for now */}
                    <h1>Welcome to the Tour Guide Dashboard</h1>
                    <p>Select an option from the sidebar to get started.</p>

        </div>
    );
};

export default TourGuideHomepage;
