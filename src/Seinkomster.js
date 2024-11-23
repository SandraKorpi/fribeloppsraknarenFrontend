import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import HourService from './HourService'; // Importera din HourService
import './Main.css'
import './SeInkomster.css'

function Seinkomster() {
    const [months, setMonths] = useState([]);
    const [workedHoursDetails, setWorkedHoursDetails] = useState(""); // För att lagra detaljer om arbetade timmar

    // Formatmetod för att lägga till extra radbrytningar
    const formatWorkedHoursDetails = (details) => {
        return details.split("\n").join("\n\n"); // Lägg till extra radbrytningar mellan varje post
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const monthsData = await HourService.fetchUniqueMonths();
                setMonths(monthsData);
            } catch (error) {
                console.error("Fel vid hämtning av månader:", error);
            }
        }

        fetchData();
    }, []); // Körs bara en gång när komponenten laddas

    // Funktion för att hämta detaljer om arbetade timmar när en månad väljs
    const handleMonthSelect = async (year, month) => {
        try {
            const details = await HourService.getWorkedHoursDetails(year, month);
            const formattedDetails = formatWorkedHoursDetails(details); // Formatera detaljer innan vi sätter till state
            setWorkedHoursDetails(formattedDetails); // Sätt detaljer i state för att visa i textrutan
        } catch (error) {
            console.error("Fel vid hämtning av arbetade timmar:", error);
            setWorkedHoursDetails("Kunde inte hämta detaljer om arbetade timmar.");
        }
    };

    return (
        <div className="main-content-wrapper">
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Välj månad
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {months.map((item, index) => (
                        <Dropdown.Item
                            key={index}
                            onClick={() => handleMonthSelect(item.year, item.month)} // Hämta detaljer för vald månad
                        >
                            {item.month}/{item.year}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <div className="details-box">
                <h4>Detaljer för valda arbetade timmar:</h4>
                <textarea
                    rows="10"
                    cols="50"
                    value={workedHoursDetails} // Visar detaljer om arbetade timmar
                    readOnly
                />
            </div>
        </div>
    );
}

export default Seinkomster;
