import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './Main.css'

const MenuNav = [
    {
        label: "Hem",
        url: "/Homelogedin",
    },
    {
        label: "Hantera inkomster",
        url: "/hanterainkomster",
    },
    {
        label: "Se inkomster",
        url: "/seinkomster",
    },
];

function Navigation() {
    return (
        <Navbar expand="lg" className="custom-navbar">
            {/* Toggle-knapp och hamburgermeny */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {MenuNav.map((item, index) => (
                        <Nav.Link href={item.url} key={index}>
                            {item.label}
                        </Nav.Link>
                    ))}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
