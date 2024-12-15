import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatorHeader from './CoordinatorHeader';
import Sidebar from './CoordinatorSidebar';
import OnayBekleyen from './OnayBekleyen';
import CounselorList from '../common/CounselorList';
import TourSchedule from '../tourguidepages/TourSchedule';
import TourApplications from '../common/TourApplications';
import FairSchedule from '../common/FairSchedule';
import FairInvitations from '../common/FairInvitations';
import BtoKoordinasyonu from './BtoKoordinasyonu';
import MainPage from '../mainpage/MainPage'; // Default page when no route is matched

const CoordinatorHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    return (
        <div className="coordinator-homepage">
            <CoordinatorHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? 'with-sidebar' : ''
                    }`}
                >
                    // empty rn //
                </div>
            </div>
        </div>
    );
};

export default CoordinatorHomepage;
