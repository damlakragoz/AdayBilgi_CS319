import React from 'react';
import Header from './MainPageHeader';
import Navbar from './NavbarMainPage';
import ContentSection from './ContentSection';
import './MainPage.css';

const MainPage = () => {
    return (
        <div className="main-page">
            <Header/>
            <ContentSection/>
        </div>
    );
};

export default MainPage;
