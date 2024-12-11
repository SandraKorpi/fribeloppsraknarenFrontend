import React, { useEffect, useState } from 'react';
import UserService from './UserService';
import { Modal, Button, Form } from 'react-bootstrap';
import './Main.css';
import Seinkomster from './Seinkomster';

function MinaSidor() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [updatedUserDetails, setUpdatedUserDetails] = useState({
        userName: '',
        email: '',
    });
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // Uppdaterad här

    // Hämta användardetaljer
    const fetchUserDetails = async () => {
        try {
            const details = await UserService.fetchUserDetails();
            setUserDetails(details);
            setUpdatedUserDetails({
                userName: details.userName,
                email: details.email,
            });
            setLoading(false);
        } catch (error) {
            console.error("Fel vid hämtning av användardetaljer:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    if (loading) {
        return <div>Laddar användardetaljer...</div>;
    }

    if (!userDetails) {
        return <div>Kunde inte hämta användardetaljer.</div>;
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedUserDetails({
            ...updatedUserDetails,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            // Kontrollera om användardetaljer har ändrats
            if (
                updatedUserDetails.userName !== userDetails.userName ||
                updatedUserDetails.email !== userDetails.email
            ) {
                // Uppdatera användardetaljer på backend
                await UserService.updateUserDetails(
                    updatedUserDetails.userName,
                    updatedUserDetails.email
                );

                // Hämta de senaste användardetaljerna och uppdatera lokalt tillstånd
                await fetchUserDetails();
            }

            // Stäng modalen efter lyckad uppdatering
            setShowModal(false);
        } catch (error) {
            console.error("Fel vid sparande av användardetaljer:", error);
            alert("Ett fel uppstod vid uppdatering av dina uppgifter. Försök igen.");
        }
    };


    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        console.log(`Name: ${name}, Value: ${value}`); // Logga när fältet ändras
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else if (name === 'currentPassword') { // Uppdaterad här
            setCurrentPassword(value); // Uppdaterad här
        }
    };

    const handleUpdatePassword = async () => {
        // Logga värdena innan vi skickar dem till servern
        console.log("Current Password:", currentPassword); // Uppdaterad här
        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);

        if (newPassword !== confirmPassword) {
            alert("Lösenorden matchar inte.");
            return;
        }

        try {
            // Uppdatera lösenordet
            await UserService.updatePassword(currentPassword, newPassword, confirmPassword); // Uppdaterad här
            // När lösenordet är uppdaterat, nollställ lösenordsfält
            setCurrentPassword(''); // Uppdaterad här
            setNewPassword('');
            setConfirmPassword('');
            setIsPasswordChange(false);
            alert("Lösenordet har uppdaterats!");
        } catch (error) {
            console.error("Fel vid uppdatering av lösenord:", error);
        }
    };
    return (
        <div className="main-content-wrapper"> {/* En enhetlig behållare */}
            <div className="content-box"> {/* Ny wrapper runt allt innehåll */}
                <h2>Din information:</h2>
                <div className="user-details">
                    <p><strong>Namnet:</strong> {userDetails.userName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Ändra
                    </Button>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
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

                            <Button variant="link" onClick={() => setIsPasswordChange(!isPasswordChange)}>
                                {isPasswordChange ? "Avbryt byt lösenord" : "Byt lösenord"}
                            </Button>

                            {isPasswordChange && (
                                <>
                                    <Form.Group controlId="currentPassword">
                                        <Form.Label>Nuvarande lösenord</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="currentPassword"
                                            value={currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="newPassword">
                                        <Form.Label>Nytt lösenord</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="confirmPassword">
                                        <Form.Label>Bekräfta lösenord</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" onClick={handleUpdatePassword}>
                                        Uppdatera lösenord
                                    </Button>
                                </>
                            )}
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

                {/* för detaljer om timmarna*/}
                <div className="work-details">
                    <Seinkomster/>
                </div>
            </div>
        </div>
    );
}

export default MinaSidor;
