import { Route,Routes } from "react-router-dom";
import Navbar from"./components/Navbar";
import Footer from"./components/Footer";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";


import Home from"./pages/Home";
import Planets from"./pages/Planets";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Articles from "./pages/Articles";
import ProtectedRoute from "./components/ProtectedRoute";
import Kommentek from "./pages/Kommentek";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/planets"
                    element={
                        <ProtectedRoute>
                            <Planets />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <Events />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events/:id"
                    element={
                        <ProtectedRoute>
                            <EventDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/kommentek"
                    element={
                        <ProtectedRoute>
                            <Kommentek />
                        </ProtectedRoute>
                    }
                />

                <Route path="/articles" element={<Articles />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
