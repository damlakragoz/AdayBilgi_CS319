// Dashboard.js
import React from 'react';
import NavigationBar from '../common/NavigationBar';  // NavigationBar is now in the common folder
import ApplicationTable from './ApplicationTable';
import UniversityInvitations from './UniversityInvitations';


const Dashboard = () => {
    return (
        <div>
            {/* Include the navigation bar at the top */}
            <NavigationBar />
            
            {/* Include the application table below the navigation bar */}
            <div className="dashboard-content">
                <ApplicationTable />
                <UniversityInvitations />  {/* Add the university invitations section */}
            </div>
        </div>
    );
};

export default Dashboard;
