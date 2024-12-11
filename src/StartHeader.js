// Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Header() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <img
                    src="/loggan.png"  // Ange sökvägen till bilden i public-mappen
                    alt="Fribeloppsräknaren logo"
                    style={{height: '40px'}}  // Justera storleken på bilden om du vill
                />
            </Container>
        </Navbar>
    );
}

export default Header;
