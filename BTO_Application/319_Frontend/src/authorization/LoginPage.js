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
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    axios.defaults.baseURL = 'http://localhost:8081';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loginData.username.trim() === '' || loginData.password.trim() === '') {
            toast.warn('Lütfen kullanıcı adı ve şifre alanlarını doldurun.');
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', {
                username: loginData.username,
                password: loginData.password,
            });

            const roleResponse = await axios.post('/api/auth/user-role', {
                username: loginData.username,
                password: loginData.password,
            });

            const role = roleResponse.data;

            if (response.status === 200 && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('userToken', token);
                localStorage.setItem('username', loginData.username);
                localStorage.setItem('role', role);

                console.log('Role:', role); // Log the role for debugging
                switch (role) {
                    case 'Coordinator':
                        navigate('/coordinator-homepage');
                        break;
                    case 'Counselor':
                        navigate('/anasayfa/rehber-ogretmen');
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
                        toast.error('Rolünüz tanımlanamadı. Lütfen yöneticinizle iletişime geçin.');
                        console.error('Unhandled role:', role);
                        navigate('/applications');
                        break;
                }
            } else {
                toast.error('Giriş başarısız. E-mail veya şifrenizi doğru girdiğinizden emin olun.');
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.status === 401) {
                toast.error('Geçersiz kullanıcı adı veya şifre');
            } else if (err.response && err.response.status === 500) {
                toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            } else {
                toast.error('Bilinmeyen bir hata oluştu.');
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
                <h2>AdayBilgi'ye Giriş Yap</h2>
                <center>
                    <p>Bilkent Tanıtım Ofisinin hizmetlerine AdayBilgi üzerinden ulaşın.</p>
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
                        type={showPassword ? 'text' : 'password'} // Toggle password visibility
                        name="password"
                        placeholder="Şifrenizi girin"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="password-toggle">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={toggleShowPassword}
                        />
                        <label htmlFor="showPassword">Şifreyi Göster</label>
                    </div>
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