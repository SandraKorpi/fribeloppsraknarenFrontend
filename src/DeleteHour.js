import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import HourService from "./HourService";
import './Modal.css';
import Calendar from "./calendar";

Modal.setAppElement('#root');

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
            const month = date.getMonth() + 1;
            const day = date.getDate();

            await HourService.deleteHour(year, month, day);
            refreshCalendar();
           // onDelete();  // För att uppdatera föräldern när raderingen är klar
            onClose();   // Stänger modalen

        } catch (error) {
            setError('Något gick fel vid raderingen.');
            console.error("Fel vid radering av timmar:", error);
        }
    };

    return (
        <Modal isOpen={show} onRequestClose={onClose} contentLabel="Bekräfta Radering">
            <h2>Bekräfta Radering</h2>
            <p>Är du säker på att du vill radera timmarna för {date?.toLocaleDateString()}?</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <button className="primary-button" onClick={confirmDelete}>Ja</button>
                <button className="primary-button" onClick={onClose}>Nej</button>
                <button className="primary-button" onClick={onClose}>Stäng</button>
            </div>
        </Modal>
    );
};

export default DeleteHour;
