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
    const [isHovered, setIsHovered] = useState(false);


    return (
        <div className="executive-homepage">
            <div
                className="advisor-homepage"
                style={{
                    position: 'relative',
                    alignItems: 'center',
                    backgroundImage: 'url(/images/slider5.jpg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'left',
                    overflow: 'hidden',
                    margin: -20,
                    top: -10,

                }}
            >

                {/* Transparent box with hover effect */}
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        backgroundColor: isHovered
                            ? 'rgba(0, 0, 0, 0.7)' // Darker when hovered
                            : 'rgba(0, 0, 0, 0.5)', // Default transparency
                        borderRadius: '8px',
                        padding: '20px',
                        transition: 'background-color 0.3s ease-in-out', // Smooth transition
                        margin: 'auto', // Center the box within the container
                        position: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                            margin: '0 0 20px 0',
                            textAlign: 'center',
                        }}
                    >
                        Yönetici Ana Sayfasına Hoş Geldiniz!
                    </h1>
                    <p
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                            textAlign: 'center',
                            margin: 0,
                        }}
                    >
                        İşlem yapmak için sol taraftaki menüyü kullanabilirsiniz.
                    </p>
                </div>
                <ExecutiveHeader toggleSidebar={toggleSidebar}/>
                <div className="d-flex">
                    <ExecutiveSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                    <div
                        className={`content-container flex-grow-1 ${
                            sidebarOpen ? 'with-sidebar' : ''
                        }`}
                        style={{
                            position: 'center',
                            padding: '20px',
                            zIndex: 2,
                        }}
                    >

                    </div>
            // empty rn //
        </div>
</div>
</div>
)
    ;
};

export default ExecutiveHomepage;




