import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import HourService from './HourService';
import './Modal.css';

Modal.setAppElement('#root');

const AddHours = ({ show, onClose, date, refreshCalendar }) => {
    const [hours, setHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [vacationPay, setVacationPay] = useState("");
    const [error, setError] = useState(null);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);
    const navigate = useNavigate();

    // Kontroll för om datum är valt
    useEffect(() => {
        if (date) {
            setYear(date.getFullYear());
            setMonth(date.getMonth() + 1); // Månader är 0-indexerade
            setDay(date.getDate());
        }
    }, [date]);

    // Kallar på metoden som skickar timmarna till API:et.
    const handleInkomster = async (e) => {
        e.preventDefault();
        try {
            const response = await HourService.addHours(hours, month, day, year, hourlyRate, vacationPay);
            console.log("Registrering av timmar fungerade:", response);
            setError(null);
            onClose(); // Stänger modalen när registreringen är klar.
            refreshCalendar(); // Uppdaterar kalendern
        } catch (error) {
            console.error("Fel vid registrering av timmar:", error);
            setError("Något blev fel vid registrering av dina timmar.");
        }
    };

    // Om inget datum är valt
    if (!date) {
        return <div>Inget datum valt</div>;
    }

    return (
        <Modal isOpen={show} onRequestClose={onClose} contentLabel="Lägg till timmar">
            <h3>Valt datum: År: {year}, Månad: {month}, Dag: {day}</h3>
            <h2>Fyll i ditt arbetspass:</h2>
            <form onSubmit={handleInkomster}>
                <div>
                    <label>Antal timmar:</label>
                    <input
                        type="text"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Timlön i kr:</label>
                    <input
                        type="text"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Semesterersättning i procent:</label>
                    <input
                        type="text"
                        value={vacationPay}
                        onChange={(e) => setVacationPay(e.target.value)}
                    />
                </div>
                <button type="submit">Skicka</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={onClose}>Stäng</button>
        </Modal>
    );
};

export default AddHours;
