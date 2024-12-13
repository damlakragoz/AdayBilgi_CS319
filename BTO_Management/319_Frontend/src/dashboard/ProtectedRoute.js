import React, { useState } from 'react';
import {Navigate} from 'react-router-dom';

// ProtectedRoute Component to guard routes that require authentication
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');
    console.log(token);
    return token ? children : <Navigate to="/" />;
};
export default  ProtectedRoute ;