// Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import MenuNav from "./MenuNav";

function Header() {
    return (
        <div className="header">
            <div className="header-top">
                <img
                    src="/loggan.png"  // Ange sökvägen till bilden i public-mappen
                    alt="Fribeloppsräknaren logo"
                    style={{
                        height: '140px',   // Justera storleken
                        margin: 0,         // Ta bort yttre mellanrum
                        padding: 0,        // Ta bort inre mellanrum
                    }} // Justera storleken på bilden om du vill

                />
                <Navbar.Brand href="#">Håll reda på dina inkomster under studietiden med Fribeloppsräknaren.</Navbar.Brand>
            </div>
            <div className="header-bottom">
                <Navbar expand="lg">
                    <Container>
                        <MenuNav/>
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}
export default Header;
