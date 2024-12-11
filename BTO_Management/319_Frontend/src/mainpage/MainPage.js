import React, {useEffect, useState} from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

const MainPage = () => {
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
            <header className="main-header">
                <nav className="navbar">
                  <div className="cpf">
                    <a href="#contact">İletişim</a>
                    <a href="#photos">Fotoğraflarla Bilkent</a>
                    <a href="#faq">Sıkça Sorulan Sorular</a>
                  </div>

                  <div className="searchbar">
                    <input className="search-bar" type="text" placeholder="Sitede ara..." />
                  </div>

                  <div className="socials">
                    <a href="#facebook">Facebook</a>
                    <a href="#instagram">Instagram</a>
                    <a href="#twitter">Twitter</a>
                  </div>
                </nav>
            </header>

            <nav className="subnavbar">

                            <div className="bilkent-logo-container" onClick={() => navigate('/AnaSayfa')}>
                              <a href="#bilkent">
                                <img src="/images/adaybilgilogo.svg" alt="Bilkent Logo" className="bilkent-logo-image" />
                                MainPage
                              </a>
                            </div>
              <div className= "login">
                <a href="#login" onClick={() => navigate('/tourguide-puantage')} >Login</a>
              </div>
            </nav>

            <nav className="subnavbar2">
              <div className="contents">
                <div className="dropdown_1">
                  <a href="#tanitim">Tanıtım</a>
                    <div className="tanitim-dropdown-content">
                      <a href="#link1">Kampüs Ziyaretleri</a>
                      <a href="#link2">Meslek Seminerleri</a>
                      <a href="#link3">Sanal Kampüs Turu</a>
                      <a href="#link4">Tanıtım Kitapçığı</a>
                      <a href="#link5">Tanıtım Videoları</a>
                    </div>
                </div>

                <a href="#photos">ÖSYS Bilgileri</a>
                <a href="#faq">Eğitim Programları</a>
                <a href="#faq">Ücretler-Burslar</a>
                <a href="#faq">Akademik Bilgiler</a>
                <a href="#faq">Kampüste Yaşam</a>
                <a href="#faq">Mezunlar</a>
                <a href="#faq">Sorular</a>
              </div>
            </nav>

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
