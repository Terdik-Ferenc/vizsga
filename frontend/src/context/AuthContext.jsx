import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    /**
     * A login függvény elfogad egy JWT access tokent VAGY egy userData objektumot.
     * Ha stringként kap egy tokent, automatikusan dekódolja.
     */
    const login = (tokenOrUserData) => {
        let userData;

        if (typeof tokenOrUserData === "string") {
            // Ha tokent kaptunk (string), dekódoljuk a JWT payloadot
            const decoded = jwtDecode(tokenOrUserData);
            
            userData = {
                username: decoded.username,
                is_superuser: decoded.is_superuser || false,
                is_staff: decoded.is_staff || false,
                userId: decoded.user_id,
            };
        } else {
            // Ha már kész objektumot kaptunk
            userData = tokenOrUserData;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;