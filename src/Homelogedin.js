import React, {useEffect, useState} from 'react';
import {Route} from "react-router-dom";
import Calendar from "./calendar";


const Homelogedin = () => {
   // const [income, setIncome] = useState(null);

    return (
        <div className={"Home-container"}>
        <div className={"info-text"}>
            <h1>Välkommen till fribelopps-räknaren!</h1>
            <p>Klicka på ett datum för att fylla i dina arbetspass i kalendern..</p>
        </div>
            <div className="centered-calendar">
                <Calendar/>
            </div>
            </div>
    );
};

export default Homelogedin;