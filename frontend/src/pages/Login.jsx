import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Bejelentkezési kérés közvetlenül a Django backend felé
            const response = await axios.post(`${API_BASE_URL}/api/auth/login/`, {
                username,
                password,
            });

            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;

            // Tokenek elmentése a LocalStorage-ba
            if (refreshToken) {
                localStorage.setItem("refresh_token", refreshToken);
            }
            localStorage.setItem("access_token", accessToken);

            // Context frissítése a tokennel
            login(accessToken);

            // Token dekódolása a jogosultság ellenőrzéséhez
            const decoded = jwtDecode(accessToken);

            // Átirányítás a jogosultság alapján
            if (decoded.is_superuser) {
                navigate("/Profile");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error("Bejelentkezési hiba:", err);
            setError("Hibás felhasználónév vagy jelszó.");
        }
    };

    return (
        <div className="page">
            <h1>Bejelentkezés</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Felhasználónév"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br />
                <br />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button className="btn-login-register" type="submit">Belépés</button>
            </form>
        </div>
    );
}

export default Login;