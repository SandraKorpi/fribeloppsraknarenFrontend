import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HourService from "./HourService";
import Modal from "react-modal";
import './Modal.css';

Modal.setAppElement('#root');

const UpdateHours = ({ show, onClose, date, refreshCalendar }) => {
    // Tar in datumet från kalendern.
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedDateStr = params.get('selectedDate');
    const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;

    // Tillståndsvariabler för att spara inputvärden och datumets komponenter
    const [hours, setHours] = useState("");
   // const [date, setDate] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [vacationPay, setVacationPay] = useState("");
    const [error, setError] = useState(null);
    const [year, setYear] = useState(null); // Nytt tillstånd för år
    const [month, setMonth] = useState(null); // Nytt tillstånd för månad
    const [day, setDay] = useState(null); // Nytt tillstånd för dag
    const navigate = useNavigate();

    // Kontroll för om datum är valt
    useEffect(() => {
        if (selectedDate) {
            setYear(selectedDate.getFullYear());
            setMonth(selectedDate.getMonth() + 1); // Månader är 0-indexerade
            setDay(selectedDate.getDate());
        }
    }, [selectedDate]);

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
            const response = await HourService.updateHour(hours, month, day, year, hourlyRate, vacationPay);
            console.log("Updateringen av timmar fungerade:", response);
            setError(null);
            onClose(); // Stänger modalen när registreringen är klar.
            refreshCalendar(); // Uppdaterar kalendern
        } catch (error) {
            console.error("Fel vid updatering av timmar:", error);
            setError("Något blev fel vid uppdateringen av dina timmar.");
        }
    };

    return (
        <Modal isOpen={show} onRequestClose={onClose} contentLabel="Ändra timmar">
            <h3>Valt datum: År: {year}, Månad: {month}, Dag: {day}</h3>
            <h2>Fyll i ditt arbetspass för att göra ändringar:</h2>
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
                <button onClick={onClose}>Stäng</button>
            </form>
            {error && <p style={{color: "red" }}>{error}</p>}
        </Modal>
    );
};

export default UpdateHours;