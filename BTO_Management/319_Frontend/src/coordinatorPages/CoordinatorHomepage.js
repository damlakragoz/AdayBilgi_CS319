// CoordinatorHomepage.js
import React from 'react';
import CoordinatorNavbar from './CoordinatorNavbar';
import CounselorList from '../common/CounselorList';

const CoordinatorHomepage = () => {
    return (
        <div className="coordinator-homepage">
            <CoordinatorNavbar />
            <h1>Welcome to the Coordinator Homepage</h1>
            <p>This is an empty page for now.</p>
        </div>
    );
};

export default CoordinatorHomepage;
