import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, token }) => {
    if (!token) {
        // If there's no token, redirect to login
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        // Spring Security authorities are in the 'authorities' claim
        const userRoles = decodedToken.authorities || [];

        if (userRoles.includes('ROLE_ADMIN')) {
            // If user has ROLE_ADMIN, render the component
            return children;
        } else {
            // If user is not an admin, redirect to the homepage
            return <Navigate to="/" />;
        }
    } catch (error) {
        // If token is invalid, redirect to login
        console.error("Invalid token:", error);
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
