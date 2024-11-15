import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

const MainPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(''); // State to store error message

    const navigate = useNavigate();

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

            // If login is successful, store the user's email or token in localStorage
            if (response.status === 200) {
                localStorage.setItem('userToken', response.data.token || loginData.username);
                navigate('/applications'); // Navigate to the applications page
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password'); // Set error message if login fails
        }
    };

    return (
        <div className="main-page">
            <header className="main-header">
                <nav className="navbar">
                    <ul className="navbar-links">
                        <li><a href="#contact">İletişim</a></li>
                        <li><a href="#photos">Fotoğraflarla Bilkent</a></li>
                        <li><a href="#faq">Sıkça Sorulan Sorular</a></li>
                    </ul>
                    <input className="search-bar" type="text" placeholder="Sitede ara..." />
                </nav>
            </header>

            {/* Main content area */}
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

export default MainPage;
