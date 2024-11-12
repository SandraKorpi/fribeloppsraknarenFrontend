import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ApiService from "./ApiService";

function RegisterUser() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.register(userName, password, email);
            console.log("Registrering lyckades:", response);
            setError(null);
            setSuccessMessage("Registrering lyckades! Du omdirigeras snart till inloggningssidan.");

            // Fördröj omdirigeringen till inloggningssidan
            setTimeout(() => {
                navigate("/"); // Ändra sökväg vid behov
            }, 3000); // Vänta 3 sekunder
        } catch (error) {
            console.error("Fel vid registrering:", error);
            setError("Fel vid registrering.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }} className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Registrera dig</h3>
                    {error && <p className="text-danger text-center">{error}</p>}
                    {successMessage && <p className="text-success text-center">{successMessage}</p>}
                    <Form onSubmit={handleRegistration}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Namn</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ange ditt namn"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ange din email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Lösenord</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ange ditt lösenord"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Registrera
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterUser;
