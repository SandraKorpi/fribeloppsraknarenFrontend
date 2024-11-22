// Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import MenuNav from "./MenuNav";

function Header() {
    return (
        <Navbar className="header" expand="lg">
            <Container>
                <Navbar.Brand href="#">Fribelopps-räknaren</Navbar.Brand>
                <MenuNav/>
            </Container>
        </Navbar>
    );
}

export default Header;
