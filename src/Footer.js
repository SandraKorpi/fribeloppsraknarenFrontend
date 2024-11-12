// Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3">
            <Container>
                <small>&copy; {new Date().getFullYear()} Sandra Korpis examensarbete JIN23</small>
            </Container>
        </footer>
    );
}

export default Footer;
