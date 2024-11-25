import React, {useEffect, useState} from 'react';
import {Route} from "react-router-dom";
import Calendar from "./calendar";


const Homelogedin = () => {
   // const [income, setIncome] = useState(null);

    return (
        <div className={"Home-container"}>
        <div className={"info-text"}>
            <h1>Välkommen till Mina Sidor</h1>
            <p>Här kan du se och hantera ditt innehåll.</p>
        </div>
            <div className="centered-calendar">
                <Calendar/>
            </div>
            </div>
    );
};

export default Homelogedin;