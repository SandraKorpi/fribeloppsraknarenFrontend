import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import RegisterUser from './RegisterUser';
import Homelogedin from './Homelogedin';
import Header from './Header';
import Footer from './Footer';
import AddHours from './AddHours';
import UpdateHours from './UpdateHours';
import DeleteHour from './DeleteHour';
import Seinkomster from './Seinkomster';
import MinaSidor from './MinaSidor';
import PrivateRoute from './PrivateRoute'; // Importera PrivateRoute-komponenten
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from "./AuthContext";
import Infotext from "./Infotext";

function App() {
    return (
        <AuthProvider>
        <Router>
            <div>
                {/* Header visas på varje sida */}
                <Header />

                {/* Definiera sidans innehåll baserat på URL */}
                <Routes>
                    {/* Offentliga sidor */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<RegisterUser />} />

                    {/* Privata sidor */}
                    <Route
                        path="/homelogedin"
                        element={
                            <PrivateRoute>
                                <Homelogedin />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addHours"
                        element={
                            <PrivateRoute>
                                <AddHours />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/updateHours"
                        element={
                            <PrivateRoute>
                                <UpdateHours />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/deleteHour"
                        element={
                            <PrivateRoute>
                                <DeleteHour />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/seinkomster"
                        element={
                            <PrivateRoute>
                                <Seinkomster />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/MinaSidor"
                        element={
                            <PrivateRoute>
                                <MinaSidor />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/Infotext"
                        element={
                            <PrivateRoute>
                                <Infotext />
                            </PrivateRoute>
                        }
                    />
                </Routes>

                {/* Footer visas på varje sida */}
                <Footer />
            </div>
        </Router>
            </ AuthProvider>
    );
}

export default App;


