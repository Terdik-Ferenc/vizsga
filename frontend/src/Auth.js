// src/Auth.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // csomag a token kibontásához
import './Auth.css';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTÁLÁS

const Auth = () => {
    // 2. NAVIGÁCIÓS FÜGGVÉNY INICIALIZÁLÁSA
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
//-------
    const [loggedInUser, setLoggedInUser] = useState(null);  // próba.. a bejelentkezett user kiíratásához egy uj state kell
//-------    
    // állapotok az admin funkciókhoz
    const [isAdmin, setIsAdmin] = useState(false);
    const [userList, setUserList] = useState([]);

    // Bejelentkezéskezelő függvény módosítása
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const url = isLogin 
            ? 'http://localhost:8000/api/auth/login/' 
            : 'http://localhost:8000/api/auth/register/';

        try {
            const response = await axios.post(url, { username, password });

            if (isLogin) {
                const accessToken = response.data.access;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', response.data.refresh);
                
                // TOKEN DEKÓDOLÁSA: Megnézzük mi van benne
                const decoded = jwtDecode(accessToken);
                setMessage(`Sikeresen beléptél mint: ${decoded.username}`);
                //------
                setLoggedInUser(decoded.username);  // a user elmentése a kiíratáshoz
                //------
                
                if (decoded.is_superuser) {
                    setIsAdmin(true);
                    fetchUsers(accessToken); // Ha admin, egyből le kérjük a listát
                } else {
                    setIsAdmin(false);
                    setUserList([]);
                }

                // 3. ÁTIRÁNYÍTÁS A SIKERES BELÉPÉS UTÁN
                // Várhatunk picit, hogy a felhasználó lássa a sikeres üzenetet, vagy azonnal átirányítjuk
  //              setTimeout(() => {
                navigate('/Egitestek'); // Ide írd azt az útvonalat, ami az Égitestekre mutat!
      //          }, 1000); // 1 másodperc késleltetés (opcionális)


            } else {
                setMessage('Sikeres regisztráció! Most már bejelentkezhetsz.');
                setIsLogin(true);
            }


        } catch (error) {
            setMessage('Hiba: ' + (error.response?.data?.detail || 'Sikertelen művelet!'));
        }
    };

    // Felhasználók listájának lekérése a Django-tól
    const fetchUsers = async (token) => {
        const activeToken = token || localStorage.getItem('access_token');
        try {
            const response = await axios.get('http://localhost:8000/api/admin/users/', {
                headers: { Authorization: `Bearer ${activeToken}` }
            });
            setUserList(response.data);
        } catch (error) {
            console.error("Nem sikerült a felhasználók lekérése", error);
        }
    };

    // Felhasználó törlése funkció
    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('access_token');
        if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

        try {
            await axios.delete(`http://localhost:8000/api/admin/users/${userId}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Felhasználó törölve!");
            fetchUsers(token); // Lista frissítése törlés után
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
        //-----
        setLoggedInUser(null);    // kinullázom a saját userstate-met
        //----
    };

    return (
        <div className = "auth" >
            <h2>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h2>

            {/* ------ login input mezők ----------*/}
            <form onSubmit={handleSubmit} className = "loginform" >
                <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? 'Belépés' : 'Regisztrálás'}</button>
            </form>

            {/* ------ regisztrációs link ----------*/}
            <p className='regisztracios_link' onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Nincs fiókod? Regisztrálj!' : 'Van már fiókod? Lépj be!'}
            </p>

            {/* ------ login üzenet ----------*/}
            {message && <p className='mess_age'>{message}</p>}
            
            {/* KIJELENTKEZÉS gomb */}
            <button onClick={handleLogout} className='logout_btn'>Kijelentkezés</button>            


            {/* SUPERUSER PANEL - CSAK AKKOR JELENIK MEG HA ISADMIN === TRUE */}
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
            
            {/* ------ Bejelentkezett user kiírása ----------*/}
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