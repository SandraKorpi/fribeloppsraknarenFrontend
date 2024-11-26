import React from 'react';
import { Navigate } from 'react-router-dom';
import ApiService from './ApiService'; // Anta att isAuthenticated finns här

const PrivateRoute = ({ children }) => {
    return ApiService.isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
