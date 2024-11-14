import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HourService from "./HourService";
import { Dropdown, Button } from 'react-bootstrap'; // Importera från react-bootstrap
import { Link } from 'react-router-dom'; // Importera Link för navigering
import './dot.css';

const Customcalendar = () => {
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [allDates, setAllDates] = useState([]);

    // För att få fram menyn vid klick av datum.
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    // Sätter positionen och visar menyn vid klick
    const handleDayClick = (selectedDate, event) => {
        event.preventDefault();
        setDate(selectedDate); // Uppdaterar valt datum
        console.log(selectedDate)
      console.log(selectedDate.getFullYear())
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
        console.log("Sending selectedDate to /addHours:", date);

    };

    // Stänger menyn
    const closeMenu = () => {
        setMenuVisible(false);
    };

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
                        onChange={setDate}
                        value={date}
                        tileClassName={tileClassName} // Applicera klassen på rätt datum
                        tileContent={tileContent} // Använd tileContent för att lägga till pricken
                        onClickDay={(selectedDate, event) => handleDayClick(selectedDate, event)} // Använd onClickDay för att hantera datumklick
                    />
                </div>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}

            {/* Meny som visas vid klick */}
            {menuVisible && (
                <div
                    className="context-menu"
                    style={{
                        position: "absolute",
                        top: menuPosition.y,
                        left: menuPosition.x,
                        backgroundColor: "white",
                        border: "1px solid gray",
                        padding: "10px",
                        zIndex: 1000,
                    }}

                    //Skickar till andra filer i länkarna via URL-query-parametrar istället för state.
                    //state funkade ej.
                >
                    <Dropdown.Menu show>
                        <Dropdown.Item
                            as={Link}
                            to={`/addHours?selectedDate=${date.toISOString()}`}
                        >
                            Lägg till timmar
                        </Dropdown.Item>

                        <Dropdown.Item as={Link} to={`/updateHours?selectedDate=${date.toISOString()}`}>Ändra timmar</Dropdown.Item>
                        <Dropdown.Item as={Link}     to={`/deleteHour?selectedDate=${date.toISOString()}`}
                        >Radera timmar</Dropdown.Item>
                    </Dropdown.Menu>
                    <Button variant="secondary" onClick={closeMenu}>Stäng</Button>
                </div>
            )}

            {/* Klicka utanför för att stänga menyn */}
            {menuVisible && <div className="overlay" onClick={closeMenu}></div>}
        </div>
    );
};

export default Customcalendar;

