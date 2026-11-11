import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import HourService from './HourService';

const UpdateHours = ({ show, onClose, date, refreshCalendar }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedDateStr = params.get('selectedDate');
    const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;

    const [hours, setHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [vacationPay, setVacationPay] = useState("");
    const [error, setError] = useState(null);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedDate) {
            setYear(selectedDate.getFullYear());
            setMonth(selectedDate.getMonth() + 1);
            setDay(selectedDate.getDate());
        }
    }, [selectedDate]);

    useEffect(() => {
        if (date) {
            setYear(date.getFullYear());
            setMonth(date.getMonth() + 1);
            setDay(date.getDate());
        }
    }, [date]);

    const handleInkomster = async (e) => {
        e.preventDefault();
        try {
            await HourService.updateHour(hours, month, day, year, hourlyRate, vacationPay);
            setError(null);
            onClose();
            refreshCalendar();
        } catch (error) {
            console.error("Fel vid uppdatering av timmar:", error);
            setError(error.message || "Något blev fel vid uppdateringen av dina timmar.");
        }
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Ändra timmar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Valt datum: År: {year}, Månad: {month}, Dag: {day}</p>
                <Form onSubmit={handleInkomster}>
                    <Form.Group controlId="hours">
                        <Form.Label>Antal timmar</Form.Label>
                        <Form.Control
                            type="text"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="hourlyRate" className="mt-3">
                        <Form.Label>Timlön i kr</Form.Label>
                        <Form.Control
                            type="text"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="vacationPay" className="mt-3">
                        <Form.Label>Semesterersättning i procent</Form.Label>
                        <Form.Control
                            type="text"
                            value={vacationPay}
                            onChange={(e) => setVacationPay(e.target.value)}
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    <Button variant="primary" type="submit" className="mt-3">
                        Skicka
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Stäng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateHours;
