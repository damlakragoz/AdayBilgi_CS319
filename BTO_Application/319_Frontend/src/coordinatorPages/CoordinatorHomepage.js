import React, { useState } from 'react';
import CoordinatorHeader from './CoordinatorHeader';
import Sidebar from './CoordinatorSidebar';

const CoordinatorHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div
            className="coordinator-homepage"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                backgroundImage: 'url(/images/kampus4.jpg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity: isHovered ? 0.8 : 1,
                transition: 'opacity 0.3s ease-in-out',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Common semi-transparent background
                    borderRadius: '8px', // Rounded corners
                    padding: '20px', // Padding around the text
                    textAlign: 'center', // Center-align all text inside
                    position: 'center',
                }}
            >
                <h1
                    style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'white', // White text color
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Stronger shadow
                        margin: '0 0 20px 0', // Space below the header
                    }}
                >
                    Koordinatör Ana Sayfasına Hoş Geldiniz!
                </h1>
                <p
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Stronger shadow
                        margin: 0,
                    }}
                >
                    İşlem yapmak için sol taraftaki menüyü kullanabilirsiniz.
                </p>
            </div>
            <CoordinatorHeader toggleSidebar={toggleSidebar}/>
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? 'with-sidebar' : ''
                    }`}
                    style={{
                        padding: '20px',

                    }}
                >
                </div>
            </div>
        </div>
    );
};

export default CoordinatorHomepage;
