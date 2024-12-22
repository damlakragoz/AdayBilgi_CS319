import React, { useState } from "react";
import "../common/Sidebar.css"; // Update path if necessary
import CounselorSidebar from "./AdvisorSidebar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdvisorSidebar from "./AdvisorSidebar";

const AdvisorHomepage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
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
                    Danışman Ana Sayfasına Hoş Geldiniz!
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

            <AdvisorSidebar toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <AdvisorSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
            </div>
        </div>
    );
};

export default AdvisorHomepage;
