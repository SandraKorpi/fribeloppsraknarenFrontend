import React, {useEffect, useState} from 'react';
import {Route} from "react-router-dom";
import Calendar from "./calendar";


const Homelogedin = () => {
   // const [income, setIncome] = useState(null);

    return (
        <div>
            <h1>Välkommen till Mina Sidor</h1>
            <p>Här kan du se och hantera ditt innehåll.</p>
            <Calendar/>
        </div>
    );
};

export default Homelogedin;