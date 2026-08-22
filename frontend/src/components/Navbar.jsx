import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";


function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <h2>Galaxy Portál</h2>
            {!user ? (<h5>Bejelentkezve: ----</h5>) : (<h5>Bejelentkezve: {user.username}</h5>)}

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menü megnyitása"
            >
                ☰
            </button>

            <ul className={menuOpen ? "nav-links open" : "nav-links"}>
                <li>
                    <Link to="/" onClick={closeMenu}>
                        Főoldal
                    </Link>
                </li>

                {!user ? (
                    <>
                        <li>
                            <Link to="/login" onClick={closeMenu}>
                                Belépés
                            </Link>
                        </li>

                        <li>
                            <Link to="/register" onClick={closeMenu}>
                                Regisztráció
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/planets" onClick={closeMenu}>
                                Égitestek
                            </Link>
                        </li>

                        <li>
                            <Link to="/events" onClick={closeMenu}>
                                Események
                            </Link>
                        </li>

                        <li>
                            <Link to="/articles" onClick={closeMenu}>
                                Cikkek
                            </Link>
                        </li>

                        <li>
                            <Link to="/kommentek" onClick={closeMenu}>
                                Kommentek
                            </Link>
                        </li>


                        <li>
                            <Link to="/profile" onClick={closeMenu}>
                                Profil
                            </Link>
                        </li>

                        <li>
                            <button onClick={handleLogout}>
                                Kilépés
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;