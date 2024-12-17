import React from 'react';
import NavigationBar from '../common/NavigationBar';  // NavigationBar is now in the common folder
import ApplicationTable from './ApplicationTable';
import UniversityInvitations from './UniversityInvitations';
import CounselorTourApplicationsPage from '../counselorPages/CounselorTourApplicationsPage';

const CounselorDashboard = () => {
    return (
        <div>
            <CounselorTourApplicationsPage />
        </div>
    );
};

export default CounselorDashboard;
