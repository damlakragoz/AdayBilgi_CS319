import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Giriş öncesi token temizleme işlemi
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
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
        setError('');

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

                switch (role) {
                    case 'Coordinator':
                        navigate('/coordinator-homepage');
                        break;
                    case 'Counselor':
                        navigate('/rehber-ogretmen-anasayfa');
                        break;
                    case 'TourGuide':
                        navigate('/tur-rehberi-anasayfa');
                        break;
                    default:
                        navigate('/applications');
                        break;
                }
            } else {
                setError('Giriş başarısız: Token sağlanmadı');
            }
        } catch (err) {
            console.error('Giriş başarısız:', err);
            setError('Geçersiz kullanıcı adı veya şifre');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Kampüsümüzü Keşfedin</h2>
                <p>
                    Modern kampüsümüzün güzelliklerini ve olanaklarını rehberli turlarımızla keşfedin.
                </p>

                <form onSubmit={handleLogin} className="login-form">
                    <label>Kullanıcı Adı</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Kullanıcı adınızı girin"
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
                    <button type="submit" className="login-button">Giriş Yap</button>
                </form>

                <div>
                    <p>Hesabınız yok mu?</p>
                    <button
                        className="signup-button"
                        onClick={() => navigate('/signup')}
                    >
                        Kayıt Ol
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
