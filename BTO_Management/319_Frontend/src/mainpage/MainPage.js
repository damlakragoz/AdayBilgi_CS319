import React from 'react';
import Header from './MainPageHeader';
import Navbar from './NavbarMainPage';
import ContentSection from './ContentSection';
import Footer from './Footer';
import './MainPage.css';

const MainPage = () => {
    return (
        <div className="main-page">
            <Header />
            <Navbar />
            <ContentSection />
            <Footer />
        </div>
    );
};

export default MainPage;
