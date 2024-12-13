import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import MainPageHeader from './MainPageHeader';
import Sidebar from "../counselorPages/Sidebar";
import logo from "../assets/logo.png";

const MainPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(''); // State to store error message
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle sidebar

    useEffect(() => {
        // Clear tokens or perform other side effects
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    axios.defaults.baseURL = 'http://localhost:8081';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any existing error messages

        try {
            // Send a POST request to the backend login endpoint
            const response = await axios.post('/api/auth/login', {
                username: loginData.username,  // Assuming the backend expects 'username' instead of 'email'
                password: loginData.password,
            });

            const roleResponse = await axios.post('/api/auth/user-role', {
                username: loginData.username,  // Assuming the backend expects 'username' instead of 'email'
                password: loginData.password,
            });
            const role = roleResponse.data;
            //const role = "Counselor";

            // If login is successful, store the JWT token in localStorage
            if (response.status === 200 && response.data.token) {
                const token = typeof response.data === 'string' ? response.data : response.data.token;
                const username = response.data.username;

                // Store the JWT token and username in localStorage
                localStorage.setItem('userToken', token);
                localStorage.setItem('username', loginData.username); // Save the username
                localStorage.setItem('role', role);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token for future requests

                // Log for debugging
                console.log('Token stored in localStorage:', token);
                console.log('Username stored in localStorage:', loginData.username);
                console.log('Role:', role);

                 // Navigate based on the user's role
                switch (role) {
                    case 'Coordinator':
                        navigate('/coordinator-homepage');
                        console.log('COORDINATOR to applications page');
                        break;
                    case 'counselor':
                        //navigate('/counselor-dashboard');
                        break;
                    case 'tourGuide':
                        //navigate('/tour-guide-dashboard');
                        break;
                    default:
                        navigate('/applications'); // Fallback if the role is unknown
                        break;
                }
            } else {
                setError('Login failed: no token provided');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password'); // Set error message if login fails
        }
    };

    const handleLogout = () => {
        // Clear tokens and user-related data
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        sessionStorage.removeItem('userToken'); // In case it's stored here too

        // Navigate the user to the login page
        navigate('/');
    };


    return (
        <div className="main-page">
            <MainPageHeader toggleSidebar={toggleSidebar} />
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`content-container flex-grow-1 ${
                        sidebarOpen ? "with-sidebar" : ""
                    }`}
                >
                    {/* Main content */}
                </div>
            </div>

            {/* Main content area */}
            <main className="main-content">
                <h2>Explore Our Campus</h2>
                <p>Discover the beauty and facilities of our state-of-the-art campus through our guided tours.</p>
            </main>

            <footer className="main-footer">
                <p>© 2023 Bilkent University. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainPage;
