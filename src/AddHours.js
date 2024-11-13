import React from 'react';
import { useLocation } from 'react-router-dom';

const AddHours = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedDateStr = params.get('selectedDate');
    const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;

    if (!selectedDate) {
        return <div>Inget datum valt</div>; // Visa meddelande om inget datum valts
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // Kom ihåg att månader är 0-indexerade
    const day = selectedDate.getDate();

    return (
        <div>
            <h3>Valt datum: År: {year}, Månad: {month}, Dag: {day}</h3>
        </div>
    );
};

export default AddHours;

