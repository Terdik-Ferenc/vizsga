import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Login.css";

import { useAuth } from "../context/AuthContext";  // Kell az aktuális felhasználó lekéréséhez


function Register() {
    const { user } = useAuth();  // Ez is kell az aktuális felhasználó lekéréséhez " user.username "

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            await registerUser(username, email, password);

            alert("Sikeres regisztráció!");

            // Átirányítás a profil oldalra a jogosultság alapján
            {user.username == "admin" ? (navigate("/Profile")) : (navigate("/Login"))}
            console.log("login:", username, email);
            console.log("login:", user.username );
                

        } catch (error) {
            console.error("Regisztrációs hiba:", error);

            setError("Nem sikerült a regisztráció. A név nem tartalmazhat szóközt vagy már foglalt!");
        }
    };

    return (
        <div className="page">
            <h1>Regisztráció</h1>

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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {error && (
                    <p className="error-class" >
                        {error}
                    </p>
                )}

                <button className="btn-login-register" type="submit">
                    Regisztráció
                </button>
            </form>
        </div>
    );
}

export default Register;