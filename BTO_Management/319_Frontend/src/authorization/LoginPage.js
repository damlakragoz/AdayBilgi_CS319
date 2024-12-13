import React, {useEffect, useState} from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '../mainpage/MainPage.css';
 // Import your protected page

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(''); // State to store error message
    const navigate = useNavigate();

    useEffect(() => {
       // localStorage.removeItem('userToken');
        //sessionStorage.removeItem('userToken');

        //console.log("use effect called");
        // No need to clear tokens here
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

            // If login is successful, store the JWT token in localStorage
            if (response.status === 200 && response.data.token) {
                const token = typeof response.data === 'string' ? response.data : response.data.token;
                const username = response.data.username;

                // Store the JWT token and username in localStorage
                localStorage.setItem('userToken', token);
                localStorage.setItem('username', loginData.username); // Save the username
                localStorage.setItem('role', role);

//                axios.defaults.headers.common['Authorization'] = Bearer ${token}; // Set token for future requests

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
                        navigate('/applications');
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
        <div className="login-page">
            <main className="main-content">
                <h2>Explore Our Campus</h2>
                <p>Discover the beauty and facilities of our state-of-the-art campus through our guided tours.</p>
            </main>

            {/* Login Section */}
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <label>Email</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Kullanıcı adı girin"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Şifrenizi girin"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                {/* Add the Sign Up button here */}
                <div className="signup-container">
                    <p>Don't have an account?</p>
                    <button className="signup-button" onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </div>
            </div>

            <footer className="main-footer">
                <p>© 2023 Bilkent University. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoginPage;