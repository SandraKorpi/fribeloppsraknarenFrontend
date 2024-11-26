import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiService from "./ApiService";
import './Main.css';

const MenuNav = [
    { label: "Hem", url: "/Homelogedin" },
    { label: "Mina sidor", url: "/MinaSidor" },
    { label: "Se inkomster", url: "/seinkomster" },
];

function Navigation() {
    // Skapa ett state för att hantera autentiseringstillstånd
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Kontrollera autentisering vid första renderingen
    useEffect(() => {
        setIsAuthenticated(ApiService.isAuthenticated());
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        setIsAuthenticated(false); // Uppdatera tillståndet direkt vid utloggning
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {isAuthenticated ? (
                        <>
                            {MenuNav.map((item, index) => (
                                <Nav.Link href={item.url} key={index}>
                                    {item.label}
                                </Nav.Link>
                            ))}
                            <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                                Logga ut
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link href="/">Logga in</Nav.Link>
                            <Nav.Link href="/register">Registrera</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
