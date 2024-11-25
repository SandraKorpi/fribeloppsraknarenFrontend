import React, { useEffect, useState } from 'react';
import UserService from './UserService'; // Importera din UserService för att hämta användardata
import { Modal, Button, Form } from 'react-bootstrap'; // Importera modal och form från React Bootstrap
import './Main.css'; // Lägg till din CSS här om du behöver
import Seinkomster from './Seinkomster';
import './Modal.css';

function MinaSidor() {
    const [userDetails, setUserDetails] = useState(null); // För att lagra användardetaljer
    const [loading, setLoading] = useState(true); // För att visa en laddningsindikator
    const [showModal, setShowModal] = useState(false); // För att styra modalen
    const [updatedUserDetails, setUpdatedUserDetails] = useState({ // För att lagra uppdaterad användardata
        userName: '',
        email: '',
    });

    // Funktion för att hämta användardetaljer
    const fetchUserDetails = async () => {
        try {
            const details = await UserService.fetchUserDetails();
            setUserDetails(details); // Sätt användardetaljer i state
            setUpdatedUserDetails({
                userName: details.userName,
                email: details.email,
            }); // För att fylla i formuläret i modalen
            setLoading(false); // Ändra statusen för laddning
        } catch (error) {
            console.error("Fel vid hämtning av användardetaljer:", error);
            setLoading(false);
        }
    };

    // Hämta användardetaljer när komponenten laddas
    useEffect(() => {
        fetchUserDetails();
    }, []); // Körs endast en gång när komponenten laddas

    // Om vi är i "laddnings"-status
    if (loading) {
        return <div>Laddar användardetaljer...</div>;
    }

    // Om vi inte har några användardetaljer (t.ex. om det inte finns användardata)
    if (!userDetails) {
        return <div>Kunde inte hämta användardetaljer.</div>;
    }

    // Funktion för att hantera formulärinmatning i modalen
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserDetails({
            ...updatedUserDetails,
            [name]: value,
        });
    };

    // Funktion för att spara ändringar
    const handleSaveChanges = async () => {
        try {
            // Här kan du lägga till logik för att spara ändringar till servern
            // Exempel: await UserService.updateUserDetails(updatedUserDetails);
            console.log('Uppdaterade detaljer:', updatedUserDetails);

            // Stäng modalen efter att ändringarna har sparats
            setShowModal(false);
            // Uppdatera användardetaljer i UI:t
            setUserDetails(updatedUserDetails);
        } catch (error) {
            console.error("Fel vid sparande av användardetaljer:", error);
        }
    };

    return (
        <div className="main-content-wrapper">
            <h2>Din information:</h2>
            <div className="user-details">
                <p><strong>Namnet:</strong> {userDetails.userName}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                {/* Ändra-knappen som öppnar modalen */}
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Ändra
                </Button>
            </div>

            {/* Modal för att ändra användardetaljer */}
            <Modal show={showModal} onHide={() => setShowModal(false)} classname="modal-content">
                <Modal.Header closeButton>
                    <Modal.Title>Ändra dina uppgifter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="userName">
                            <Form.Label>Namnet</Form.Label>
                            <Form.Control
                                type="text"
                                name="userName"
                                value={updatedUserDetails.userName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={updatedUserDetails.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Avbryt
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Spara ändringar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Här inkluderas SeInkomster-komponenten */}
            <Seinkomster />
        </div>
    );
}

export default MinaSidor;
