import React, { createContext, useState, useEffect } from 'react';

// Skapa och exportera AuthContext
export const AuthContext = createContext();

// Exportera AuthProvider som en namngiven export
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Lägg till en useEffect för att läsa från localStorage när komponenten laddas
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);  // Om det finns en token, sätt användaren som autentiserad
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
