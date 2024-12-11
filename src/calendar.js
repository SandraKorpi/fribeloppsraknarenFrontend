import React, { useEffect, useState, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HourService from "./HourService";
import { Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteHour from './DeleteHour'; // Importera DeleteHour-komponenten
import './dot.css';
import AddHours from "./AddHours";
import UpdateHours from "./UpdateHours";
import './Calendar.css';

const Customcalendar = () => {
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [allDates, setAllDates] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const [modalDate, setModalDate] = useState(null);  // För att hålla koll på datumet för radering
    const [showAddModal, setShowAddModal] = useState(false);  // För "Lägg till timmar"-modalen
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // För "Radera timmar"-modalen
    const [showUpdateModal, setShowUpdateModal] = useState(false); // För uppdatera-modalen
    const [todayHours, setTodayHours] = useState(null);
    const [monthlyIncome, setMonthlyIncome] = useState(null);
    const [termIncome, setTermIncome] = useState(null);
    const [compareSemesterIncome, setCompareSemesterIncome] = useState(null);
    const [incomeLimit, setIncomeLimit] = useState(null); // För att hämta incomelimit

    const handleDayClick = (selectedDate, event) => {
        event.preventDefault();
        setDate(selectedDate);
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);

        // Sätt det valda datumet för radering
        setModalDate(selectedDate);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    // För modalerna
    const closeModals = () => {
        setShowAddModal(false);
        setShowDeleteModal(false);
        setShowUpdateModal(false);
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

    useEffect(() => {
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1;
        fetchIncome(currentYear, currentMonth);
        fetchSemesterIncome(currentYear, currentMonth);
        fetchCompareIncomeSemester(currentYear, currentMonth);
        fetchIncomeLimit(currentYear, currentMonth); // Lägg till för att hämta incomelimit
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchIncome = async (year, month) => {
        try {
            const response = await HourService.fetchMonthPay(year, month);
            setMonthlyIncome(response);
        } catch (error) {
            console.error("Fel vid hämtning av inkomst: ", error);
        }
    };

    const handleDateChange = async (newDate) => {
        setDate(newDate);
        const year = newDate.getFullYear();
        const month = newDate.getMonth() + 1;
        const day = newDate.getDate();
        await showOneHour(year, month, day);
    };

    const handleMonthChange = ({ activeStartDate }) => {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth() + 1;
        // Så att informationen byts baserat på när användaren bläddrar i kalendern.
        fetchIncome(year, month);
        fetchSemesterIncome(year, month);
        fetchCompareIncomeSemester(year, month);
        fetchIncomeLimit(year, month); // Uppdaterar incomelimit också när månaden ändras
    };

    const fetchSemesterIncome = async (year, month) => {
        try {
            const response = await HourService.getSemesterIncome(year, month);
            setTermIncome(response);
        } catch (error) {
            console.error("Fel vid hämtning av terminsinkomst: ", error);
        }
    };

    const fetchCompareIncomeSemester = async (year, month) => {
        try {
            const response = await HourService.compareSemesterIncome(year, month);
            setCompareSemesterIncome(response);
        } catch (error) {
            console.error("Fel vid hämtning av terminsinkomst: ", error);
        }
    };

    const fetchIncomeLimit = async (year, month) => {
        try {
            const response = await HourService.getSemesterDetails(year, month); // Här anropar vi metoden för att hämta incomelimit
            setIncomeLimit(response.incomeLimit)
        } catch (error) {
            console.error("Fel vid hämtning av incomelimit: ", error);
        }
    };

    const showOneHour = async (year, month, day) => {
        try {
            const storedData = await HourService.getOneHour(year, month, day);
            setTodayHours(storedData || 0); // Sätter värdet till 0 om `storedData` är null eller undefined
        } catch (error) {
            setTodayHours(0); // Sätter värdet till 0 om det inte finns att hämta
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isRegistered = allDates.some((allDate) => {
                const registeredDate = new Date(allDate.year, allDate.month - 1, allDate.date);
                return registeredDate.getTime() === date.getTime();
            });
            return isRegistered ? 'has-dot' : null;
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const isRegistered = allDates.some((allDate) => {
                const registeredDate = new Date(allDate.year, allDate.month - 1, allDate.date);
                return registeredDate.getTime() === date.getTime();
            });
            return isRegistered ? <span className="dot"></span> : null;
        }
        return null;
    };

    const refreshCalendar = async () => {
        // Uppdatera alla timmar efter raderingen
        const response = await HourService.fetchAllHours();
        setAllDates(response.map((workedHour) => ({
            year: workedHour.year,
            month: workedHour.month,
            date: workedHour.date,
        })));
        // Uppdatera inkomster vid varje ändring.
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1;
        fetchIncome(currentYear, currentMonth); // Månadens inkomst
        fetchSemesterIncome(currentYear, currentMonth); // Terminsinkomst
        fetchCompareIncomeSemester(currentYear, currentMonth); // Jämför terminsinkomst
        fetchIncomeLimit(currentMonth, currentYear); // Uppdaterar incomelimit också
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        tileClassName={tileClassName}
                        tileContent={tileContent}
                        onClickDay={(selectedDate, event) => handleDayClick(selectedDate, event)}
                        onActiveStartDateChange={handleMonthChange}
                    />
                </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {menuVisible && (
                <div
                    ref={menuRef}
                    className="context-menu"
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                    }}
                >
                    <Dropdown.Menu show>
                        <Dropdown.Item as="button" onClick={() => {
                            closeMenu();
                            setShowAddModal(true);
                        }}>
                            Lägg till timmar
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => {
                            closeMenu();
                            setShowUpdateModal(true);
                        }}>
                            Ändra timmar
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() =>{
                            closeMenu();
                            setShowDeleteModal(true)}}>
                            Radera timmar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    <Button variant="secondary" onClick={closeMenu}>Stäng</Button>
                </div>
            )}

            <AddHours
                show={showAddModal}
                onClose={closeModals}
                date={modalDate}
                refreshCalendar={refreshCalendar}
            />
            <DeleteHour
                show={showDeleteModal}
                onClose={closeModals}
                date={modalDate}
                refreshCalendar={refreshCalendar}
            />
            <UpdateHours
                show={showUpdateModal}
                onClose={closeModals}
                date={modalDate}
                refreshCalendar={refreshCalendar}
            />

            <div className="info-box">
                <h3>Dagens timmar: {todayHours !== null ? todayHours : "Laddar..."}</h3>
                <p>Månadens inkomst: {monthlyIncome !== null ? monthlyIncome : "Laddar..."}</p>
                <p>Terminens inkomst: {termIncome !== null ? termIncome : "Laddar..."}</p>
                <p> {compareSemesterIncome !== null ? compareSemesterIncome : "Laddar..."}</p>
                <p>Terminens fribelopp: {incomeLimit !== null ? incomeLimit : "Laddar..."}</p> {/* Lägg till income limit här */}
            </div>
        </div>
    );
};

export default Customcalendar;
