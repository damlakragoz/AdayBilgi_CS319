import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../authorization/LoginPage.css';
// Import your protected page

const LoginPage = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    axios.defaults.baseURL = 'http://localhost:8081';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loginData.username.trim() === '' || loginData.password.trim() === '') {
            toast.warn('Lütfen kullanıcı adı ve şifre alanlarını doldurun.', { position: 'top-center' });
            return;
        }

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
                console.log(token);
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
                    case 'Counselor':
                        navigate('/counselor-homepage');
                        break;
                    case 'TourGuide':
                        navigate('/tur-rehberi-anasayfa');
                        break;
                    case 'Executive':
                        navigate('/executive-homepage');
                        break;
                    case 'Advisor':
                        navigate('/advisor-homepage');
                        break;
                    default:
                        navigate('/applications'); // Fallback if the role is unknown
                        break;
                }
            } else {
                toast.error('Giriş başarısız. E-mail veya şifrenizi doğru girdiğinizden emin olun.', { position: 'top-center' });
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error('Geçersiz kullanıcı adı veya şifre', { position: 'top-center' });
            } else if (err.response && err.response.status === 500) {
                toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.', { position: 'top-center' });
            } else {
                toast.error('Bilinmeyen bir hata oluştu.', { position: 'top-center' });
            }
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


            {/* Login Section */}
            <div className="login-container">
                <h2>Kampüsümüzü Keşfedin</h2>
                <center>
                <p>Rehberli turlarımızla kampüsümüzün tüm güzelliklerini ve olanaklarını keşfedin.</p>
                </center>
                <form onSubmit={handleLogin} className="login-form">
                    <label>E-mail</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="E-mailinizi girin"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <label>Şifre</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Şifrenizi girin"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="login-button">
                        Giriş Yap
                    </button>
                </form>

                <a href="/forgot-password">Şifrenizi mi unuttunuz?</a>
                <center>
                <div>
                    Yalnızca rehber öğretmenler üye olabilir. Bireysel turlar için başvurmak istiyorsanız
                        <a href='/individual-application'> buraya tıklayın</a>.
                </div>
                </center>
                <button className="signup-button" onClick={() => navigate('/signup')}>
                    Rehber Öğretmen Üye Ol
                </button>

            </div>
        </div>
    );
};

export default LoginPage;