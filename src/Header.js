// Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import MenuNav from "./MenuNav";

function Header() {
    return (
        <div className="header">
            <div className="header-top">
                <Navbar.Brand href="#">Fribelopps-räknaren</Navbar.Brand>
            </div>
            <div className="header-bottom">
                <Navbar expand="lg">
                    <Container>
                        <MenuNav />
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}
export default Header;
