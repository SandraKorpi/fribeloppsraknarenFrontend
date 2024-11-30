import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "./AuthContext";
import ApiService from "./ApiService";
import "./Main.css";

const MenuNav = [
    { label: "Hem", url: "/Homelogedin" },
    { label: "Mina sidor", url: "/MinaSidor" },
    { label: "Se inkomster", url: "/seinkomster" },
];

function Navigation() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        ApiService.logout();
        setIsAuthenticated(false); // Uppdatera kontextens tillstånd
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
