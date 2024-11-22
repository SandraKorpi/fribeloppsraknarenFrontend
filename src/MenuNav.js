// App.js
import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import Seinkomster from './Seinkomster';


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
    const menuShow = (mItems) => {
        return mItems.map((item, index) => {
            if (item.submenu) {
                return (
                    <NavDropdown
                        title={item.label}
                        key={index}
                        className="dropdown-menu-dark dropend"
                    >
                        {menuShow(item.submenu)}
                    </NavDropdown>
                );
            } else {
                // Lägg varje menyval inom NavDropdown för att alltid dölja i hamburgermenyn
                return (
                    <NavDropdown.Item href={item.url} key={index}>
                        {item.label}
                    </NavDropdown.Item>
                );
            }
        });
    };

    const navStyle = {
        color: "black",
        fontWeight: "bold",
    };

    return (
        <Navbar expand="false" bg="dark" variant="dark">
            <Navbar.Brand href="#home">
                <h1 style={{ color: "white" }}>
                    <b>Fribeloppsräknaren</b> {/* Anpassa namnet här */}
                </h1>
            </Navbar.Brand>
            {/* Toggle-knapp för att visa hamburgermeny när skärmen minskas */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" style={navStyle}>
                    <NavDropdown title="Meny" id="basic-nav-dropdown">
                        {menuShow(MenuNav)}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
