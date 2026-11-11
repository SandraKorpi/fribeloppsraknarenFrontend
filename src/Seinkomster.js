import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import HourService from './HourService';
import './Main.css';
import './SeInkomster.css';

function Seinkomster() {
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [workedHoursDetails, setWorkedHoursDetails] = useState("");

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
    }, []);

    const handleMonthSelect = async (year, month) => {
        setSelectedMonth({ year, month });
        try {
            const details = await HourService.getWorkedHoursDetails(year, month);
            setWorkedHoursDetails(details);
        } catch (error) {
            console.error("Fel vid hämtning av arbetade timmar:", error);
            setWorkedHoursDetails("Kunde inte hämta detaljer om arbetade timmar.");
        }
    };

    const handleDeleteHours = async () => {
        if (!selectedMonth) {
            alert("Välj en månad först!");
            return;
        }

        const { year, month } = selectedMonth;

        try {
            await HourService.deleteAllHoursForMonth(year, month);
            alert(`Timmar för ${month}/${year} har tagits bort.`);
            setWorkedHoursDetails(""); // Rensa textrutan
        } catch (error) {
            console.error("Fel vid radering av timmar:", error);
            alert("Det gick inte att ta bort timmarna.");
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
                            onClick={() => handleMonthSelect(item.year, item.month)}
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
                    value={workedHoursDetails}
                    readOnly
                />
            </div>

            <Button
                variant="danger"
                onClick={handleDeleteHours}
                className="mt-3"
            >
                Ta bort timmar för vald månad
            </Button>
        </div>
    );
}

export default Seinkomster;
