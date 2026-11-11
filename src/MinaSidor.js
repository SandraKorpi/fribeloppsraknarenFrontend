import React, { useEffect, useState } from 'react';
import UserService from './UserService';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
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
    const [currentPassword, setCurrentPassword] = useState('');
    const [modalError, setModalError] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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
            setModalError(null);
            setShowModal(false);
        } catch (error) {
            setModalError(error.message || "Ett fel uppstod vid uppdatering av dina uppgifter. Försök igen.");
        }
    };


    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else if (name === 'currentPassword') {
            setCurrentPassword(value);
        }
    };

    const handleUpdatePassword = async () => {
        setModalError(null);
        setPasswordMessage(null);

        try {
            await UserService.updatePassword(currentPassword, newPassword, confirmPassword);
            // Nollställ fälten när lösenordet är uppdaterat
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsPasswordChange(false);
            setPasswordMessage("Lösenordet har uppdaterats.");
        } catch (error) {
            setModalError(error.message || "Det gick inte att uppdatera lösenordet.");
        }
    };

    const closeEditModal = () => {
        setShowModal(false);
        setModalError(null);
        setIsPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        setDeleteError(null);
        try {
            await UserService.deleteAccount();
            window.location.href = "/";
        } catch (error) {
            setDeleteError(error.message || "Det gick inte att radera kontot.");
            setDeleting(false);
        }
    };

    return (
        <div className="main-content-wrapper"> {/* En enhetlig behållare */}
            <div className="content-box"> {/* Ny wrapper runt allt innehåll */}
                <h2>Din information:</h2>
                <div className="user-details">
                    <p><strong>Namn:</strong> {userDetails.userName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Ändra
                    </Button>
                    {passwordMessage && <Alert variant="success" className="mt-3 py-2">{passwordMessage}</Alert>}
                </div>

                <Modal show={showModal} onHide={closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ändra dina uppgifter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalError && <Alert variant="danger" className="py-2">{modalError}</Alert>}
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <Form.Group controlId="userName">
                                <Form.Label>Namn</Form.Label>
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
                                            autoComplete="current-password"
                                            value={currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="newPassword">
                                        <Form.Label>Nytt lösenord</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            autoComplete="new-password"
                                            minLength={10}
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="confirmPassword">
                                        <Form.Label>Bekräfta lösenord</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            autoComplete="new-password"
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
                        <Button variant="secondary" onClick={closeEditModal}>
                            Avbryt
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Spara ändringar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="mt-4">
                    <Button variant="outline-danger" onClick={() => { setDeleteError(null); setShowDeleteModal(true); }}>
                        Radera mitt konto
                    </Button>
                </div>

                <Modal show={showDeleteModal} onHide={() => !deleting && setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton={!deleting}>
                        <Modal.Title>Radera konto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Ditt konto och alla dina registrerade timmar och studieuppgifter raderas permanent. Det går inte att ångra.</p>
                        {deleteError && <Alert variant="danger" className="py-2">{deleteError}</Alert>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={deleting} onClick={() => setShowDeleteModal(false)}>
                            Avbryt
                        </Button>
                        <Button variant="danger" disabled={deleting} onClick={handleDeleteAccount}>
                            {deleting ? "Raderar..." : "Radera permanent"}
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
