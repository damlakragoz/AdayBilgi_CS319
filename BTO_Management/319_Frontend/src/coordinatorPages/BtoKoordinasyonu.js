// BtoKoordinasyonu.js
import React from 'react';
import CoordinatorNavbar from './CoordinatorNavbar';
import CounselorList from '../common/CounselorList';
import TourGuideList from '../common/TourGuideList';

const BtoKoordinasyonu = () => {
    return (
        <div className="coordinator-bto-coordination">
            <h1>BTO Koordinasyonu</h1>
            <h2>Tur Rehberleri</h2>
            <CoordinatorNavbar />
            <TourGuideList/>

            <h2>Rehber Öğretmenler</h2>
            <CounselorList/>
        </div>
    );
};

export default BtoKoordinasyonu;
