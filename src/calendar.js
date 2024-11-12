import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HourService from "./HourService";
import './dot.css'; // Se till att dot.css finns i rätt mapp

const Customcalendar = () => {
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [allDates, setAllDates] = useState([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const extractedUserId = await HourService.fetchUserId();
                setUserId(extractedUserId);
            } catch (err) {
                setError("Kunde inte hämta användar-ID");
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchAllHours = async () => {
            try {
                const response = await HourService.fetchAllHours();
                setAllDates(response.map((workedHour) => ({
                    year: workedHour.year,
                    month: workedHour.month,
                    date: workedHour.date,
                })));
            } catch (error) {
                setError(error.message);
            }
        };
        fetchAllHours();
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isRegistered = allDates.some((allDate) => {
                const registeredDate = new Date(allDate.year, allDate.month - 1, allDate.date);
                return registeredDate.getTime() === date.getTime();
            });
            if (isRegistered) {
                return 'has-dot'; // Lägg till en klass för att indikera att pricken ska visas
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const isRegistered = allDates.some((allDate) => {
                const registeredDate = new Date(allDate.year, allDate.month - 1, allDate.date);
                return registeredDate.getTime() === date.getTime();
            });
            if (isRegistered) {
                return <span className="dot"></span>; // Lägg till en <span> med klassen 'dot'
            }
        }
        return null;
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        tileClassName={tileClassName} // Applicera klassen på rätt datum
                        tileContent={tileContent} // Använd tileContent för att lägga till pricken
                    />
                </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Customcalendar;
