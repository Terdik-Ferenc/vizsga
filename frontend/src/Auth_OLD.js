// src/Auth.js
import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const url = isLogin 
            ? 'http://localhost:8000/api/auth/login/' 
            : 'http://localhost:8000/api/auth/register/';

        try {
            const response = await axios.post(url, {
                username: username,
                password: password
            });

            if (isLogin) {
                // Bejelentkezés sikeres: mentsük el a tokent
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                setMessage('Sikeres bejelentkezés!');
            } else {
                // Regisztráció sikeres
                setMessage('Sikeres regisztráció! Most már bejelentkezhetsz.');
                setIsLogin(true); // Váltsunk át login nézetre
            }
        } catch (error) {
            setMessage('Hiba történt: ' + (error.response?.data?.detail || 'Ellenőrizd az adatokat!'));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setMessage('Sikeresen kijelentkeztél.');
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                <button type="submit">
                    {isLogin ? 'Belépés' : 'Regisztrálás'}
                </button>
            </form>

            <p style={{ color: 'blue', cursor: 'pointer', fontSize: '14px' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Nincs fiókod? Regisztrálj!' : 'Van már fiókod? Lépj be!'}
            </p>

            {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}

            <hr />
            <button onClick={handleLogout} style={{ marginTop: '10px' }}>Kijelentkezés</button>
        </div>
    );
};

export default Auth;