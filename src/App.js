
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import RegisterUser from './RegisterUser';
import Homelogedin from "./Homelogedin";
import Header from './Header';
import Footer from './Footer';
import AddHours from "./AddHours";
import UpdateHours from "./UpdateHours";
import DeleteHour from "./DeleteHour";
import './App.css'; // eller motsvarande fil
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <Router>
            <div>
                {/* Header visas på varje sida */}
                <Header />
                {/* Definiera sidans innehåll baserat på URL */}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/homelogedin" element={<Homelogedin />}  />
                    <Route path="/addHours" element={<AddHours />}  />
                    <Route path="/updateHours" element={<UpdateHours />}  />
                    <Route path="/deleteHour" element={<DeleteHour />}  />
                </Routes>

                {/* Footer visas på varje sida */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
