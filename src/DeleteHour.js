import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HourService from "./HourService";

const DeleteHour = () => {
    // Tar in datumet från kalendern.
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedDateStr = params.get('selectedDate');
    const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;

    // Tillståndsvariabler för att spara inputvärden och datumets komponenter
    const [error, setError] = useState(null);
    const [year, setYear] = useState(null); // Nytt tillstånd för år
    const [month, setMonth] = useState(null); // Nytt tillstånd för månad
    const [day, setDay] = useState(null); // Nytt tillstånd för dag
    const navigate = useNavigate();
//ruta för att fråga om användaren verkligen vill radera.
    const [showPopup, setShowPopup] = useState(false);
    // Kontroll för om datum är valt
    useEffect(() => {
        if (selectedDate) {
            setYear(selectedDate.getFullYear());
            setMonth(selectedDate.getMonth() + 1); // Månader är 0-indexerade
            setDay(selectedDate.getDate());
        }
    }, [selectedDate]);

    // Funktion för att öppna popup-rutan
    const handleDeleteClick = () => {
        setShowPopup(true);
    };
    // Funktion för att hantera bekräftelse av radering
    const confirmDelete = () => {
        handleInkomster();
        setShowPopup(false);
        // Lägg till din raderingslogik här, t.ex., anropa en API-funktion för att radera
        console.log("Elementet har raderats");
    };

    // Funktion för att stänga popup-rutan
    const cancelDelete = () => {
        setShowPopup(false);
    };

    // Kallar på metoden som skickar timmarna till API:et.
    const handleInkomster = async () => {
        try {
            const response = await HourService.deleteHour(year, month, day);
            console.log("Raderign av timmar fungerade:", response);
            setError(null);
            //tillbaka till hemsidan när registreringen är klar.
            navigate("/Homelogedin");
        } catch (error) {
            console.error("Fel vid radering av timmar:", error);
            setError("Något blev fel vid raderingen av dina timmar.");
        }
    };

    // Om selectedDate inte är valt, visa ett fallback-meddelande
    if (!selectedDate) {
        return <div>Inget datum valt</div>;
    }

    return (
        <div>
            <button onClick={handleDeleteClick}>Radera</button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Är du säker på att du vill radera?</p>
                        <button onClick={confirmDelete}>Ja</button>
                        <button onClick={cancelDelete}>Nej</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteHour;