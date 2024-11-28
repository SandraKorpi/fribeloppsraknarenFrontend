import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import HourService from "./HourService";

const DeleteHour = ({ show, onClose, date, refreshCalendar }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            console.log('Modal is open for date:', date);
        }
    }, [show, date]);

    const confirmDelete = async () => {
        try {
            if (!date) {
                setError('Inget datum valdes.');
                return;
            }

            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Månader är 0-indexerade
            const day = date.getDate();

            await HourService.deleteHour(year, month, day);
            refreshCalendar();
            onClose(); // Stänger modalen
        } catch (error) {
            setError('Något gick fel vid raderingen.');
            console.error("Fel vid radering av timmar:", error);
        }
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Bekräfta Radering</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Är du säker på att du vill radera timmarna för {date?.toLocaleDateString()}?</p>
                {error && <p className="text-danger">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={confirmDelete}>
                    Ja
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Nej
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteHour;
