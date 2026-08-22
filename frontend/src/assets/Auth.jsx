import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userList, setUserList] = useState([]);

    // Ha nem használsz env fájlt, maradhat a fix URL!
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const url = isLogin 
            ? `${API_BASE_URL}/api/auth/login/` 
            : `${API_BASE_URL}/api/auth/register/`;

        try {
            const response = await axios.post(url, { username, password });

            if (isLogin) {
                const accessToken = response.data.access;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', response.data.refresh);
                
                const decoded = jwtDecode(accessToken);
                setMessage(`Sikeresen beléptél mint: ${decoded.username}`);
                setLoggedInUser(decoded.username);
                
                if (decoded.is_superuser) {
                    setIsAdmin(true);
                    fetchUsers(accessToken);
                } else {
                    setIsAdmin(false);
                    setUserList([]);
                }

                navigate('/Egitestek');
            } else {
                setMessage('Sikeres regisztráció! Most már bejelentkezhetsz.');
                setIsLogin(true);
            }
        } catch (error) {
            setMessage('Hiba: ' + (error.response?.data?.detail || 'Sikertelen művelet!'));
        }
    };

    const fetchUsers = async (token) => {
        const activeToken = token || localStorage.getItem('access_token');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/users/`, {
                headers: { Authorization: `Bearer ${activeToken}` }
            });
            setUserList(response.data);
        } catch (error) {
            console.error("Nem sikerült a felhasználók lekérése", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('access_token');
        if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Felhasználó törölve!");
            fetchUsers(token);
        } catch (error) {
            setMessage("Hiba a törlés során: " + (error.response?.data?.detail || "Nincs jogosultságod."));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAdmin(false);
        setUserList([]);
        setMessage('Sikeresen kijelentkeztél.');
        setLoggedInUser(null);
    };

    return (
        <div className="auth">
            <h2>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h2>

            <form onSubmit={handleSubmit} className="loginform">
                <input 
                    type="text" 
                    placeholder="Felhasználónév" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Jelszó" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">{isLogin ? 'Belépés' : 'Regisztrálás'}</button>
            </form>

            <p className="regisztracios_link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Nincs fiókod? Regisztrálj!' : 'Van már fiókod? Lépj be!'}
            </p>

            {message && <p className="mess_age">{message}</p>}
            
            <button onClick={handleLogout} className="logout_btn">Kijelentkezés</button>

            {isAdmin && (
                <div style={{ marginTop: '30px', padding: '15px', border: '2px solid red', borderRadius: '5px' }}>
                    <h3 style={{ color: 'red', marginTop: 0 }}>Adminisztrátor Panel</h3>
                    <p>Felhasználók kezelése:</p>
                    {userList.length === 0 ? <p>Nincs törölhető felhasználó.</p> : (
                        <ul style={{ paddingLeft: '20px' }}>
                            {userList.map(user => (
                                <li key={user.id} style={{ marginBottom: '10px' }}>
                                    {user.username} ({user.email || 'nincs email'}) {' '}
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer', borderRadius: '3px' }}
                                    >
                                        Törlés
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            
            {loggedInUser && (
                <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '16px' }}>
                        Jelenleg bejelentkezve: <strong>{loggedInUser}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Auth;