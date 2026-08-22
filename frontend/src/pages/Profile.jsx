import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import profilkep from "../assets/img_avatar1.png";
import "../styles/profile.css";
import "../styles/Admin.css";
import { useNavigate } from "react-router-dom";
  
function Profile() {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Admin felhasználók betöltése, ha a bejelentkezett user admin
  useEffect(() => {
    if (user && user.is_superuser) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    const activeToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users/`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setUserList(response.data);
    } catch (error) {
      console.error("Nem sikerült a felhasználók lekérése", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("access_token");
    if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Felhasználó törölve!");
      fetchUsers();
    } catch (error) {
      setMessage("Hiba a törlés során: " + (error.response?.data?.detail || "Nincs jogosultságod."));
    }
  };

  if (!user) {
    return <h2>Nincs bejelentkezve</h2>;
  }

  
  return (
    <div className="page">
      <h1>Profil</h1>
      <h2>Üdv {user.username}!</h2>
      

      {/* {message && <p className="message">{message}</p>} */}

      <div className="Card">
        <img className="Card-img" src={profilkep} alt="Profilkép" />
        <div>
          <h4 className="CardUserName">Név: {user.username}</h4>        
        </div>
      </div>

      <hr className="my-4 border-t border-darkgray-300" />




      {/* Adminisztrátor Panel */}
      {user.is_superuser ? (
        <div className="admin-panel">
          <h3 className="admin-panel-title">Adminisztrátor Panel</h3>
          <p className="admin-panel-description">Felhasználók kezelése:</p>
          <button className="btn-btn-normal" onClick={() => navigate('/register')}> Új felhasználó hozzáadása</button>
          {userList.length === 0 ? (
            <p>Nincs törölhető felhasználó.</p>
          ) : (
            /*--------------*/


            <table className="user-table">
                <thead>
                  <tr>
                    <th>Felhasználónév</th>
                    <th>E-mail</th>
                    <th className="text-right">Művelet</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email || "nincs email"}</td>
                      <td className="text-right">
                        <button 
                          className="btn-btn-danger" 
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Törlés
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            /*--------------*/
          )}
        </div>
      ) : (<p>Ennek a felhasználónak nincs további jogosultsága: {user.username}</p>)}
    </div>
  );
}

export default Profile;