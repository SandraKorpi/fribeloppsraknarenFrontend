import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import HourService from './HourService'; // Importera din HourService

function Seinkomster() {
    const [months, setMonths] = useState([]);

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

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Välj månad
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {months.map((item, index) => (
                    <Dropdown.Item key={index} href={`#/${item.year}-${item.month}`}>
                        {item.month}/{item.year}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Seinkomster;
