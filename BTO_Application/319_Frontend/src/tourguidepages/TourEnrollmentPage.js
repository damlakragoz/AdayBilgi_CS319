import React from 'react';
import TourSchedule from './TourSchedule';
import TourGuideNavbar from './TourGuideNavbar';
import CounselorList from '../common/CounselorList';

const TourEnrollmentPage = () => {
    return (
        <div className="tourguide-tourenrollment">
            <TourGuideNavbar />
            <TourSchedule />
            <h1>Welcome to the Tour Guide Homepage</h1>
            <p>This is an empty page for now.</p>
        </div>
    );
};

export default TourEnrollmentPage;