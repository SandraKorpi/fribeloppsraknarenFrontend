import React, { useState } from 'react'; // Lägg till useState här
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ApiService from "./ApiService";
import StartHeader from "./StartHeader";

function Login() {
    const [userName, setUserName] = useState(""); // Flyttade useState till komponentnivå
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Flyttade också useNavigate till komponentnivå

    const handleLogin = async (e) => {
        e.preventDefault(); // Förhindra sidladdning
        try {
            const response = await ApiService.login(userName, password); // Kalla ApiService:s login-metod
            console.log("Inloggning lyckades:", response);
            setError(null); // Rensa eventuella felmeddelanden
            navigate("/HomeLogedIn"); // Korrekt sökväg
        } catch (error) {
            console.error("Inloggningsfel:", error);
            setError("Fel användarnamn eller lösenord"); // Visa ett felmeddelande vid misslyckad inloggning
        }
    };

    const handleRegisterClick = () => {
        // Navigera till register-sidan när knappen klickas
        navigate("/register");
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={12}><h3 className="text-center mb-4">Fribelopps-räknaren.</h3>
                </Col>
                <Col md={12}>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Användarnamn</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ange ditt användarnamn"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="lösenord" className="mb-3">
                            <Form.Label>Lösenord</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ange ditt lösenord"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Logga in
                        </Button>
                    </Form>
                    {error && <p className="text-danger text-center mt-3">{error}</p>}
                    <div className="text-center mt-3">
                        <span>Inget konto? </span>
                        <Button
                            variant="link"
                            className="p-0"
                            style={{ textDecoration: 'underline' }}
                            onClick={handleRegisterClick}  // Använd onClick för att navigera
                        >
                            Registrera dig
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
