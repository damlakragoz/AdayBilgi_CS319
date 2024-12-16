import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatorHeader from './ExecutiveHeader';
import Sidebar from './ExecutiveSidebar';
import OnayBekleyen from '../coordinatorPages/OnayBekleyen';
import CounselorList from '../common/CounselorList';
import ManagerTourSchedule from '../coordinatorPages/ManagerTourSchedule';
import TourApplications from '../common/AllTourApplications';
import FairSchedule from '../common/FairSchedule';
import FairInvitations from '../common/FairInvitations';
import BtoKoordinasyonu from '../coordinatorPages/BtoKoordinasyonu';
import MainPage from '../mainpage/MainPage';
import ExecutiveHeader from './ExecutiveHeader';
import ExecutiveSidebar from './ExecutiveSidebar';

const ExecutiveHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    return (
        <div className="executive-homepage">
            <ExecutiveHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <ExecutiveSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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

export default ExecutiveHomepage;
