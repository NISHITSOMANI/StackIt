import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on app start
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.getCurrentUser()
                .then(userData => {
                    setUser(userData);
                })
                .catch(err => {
                    console.error('Failed to get current user:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await api.login(credentials);

            localStorage.setItem('token', response.token);

            // Get user data from token or fetch current user
            const userData = await api.getCurrentUser();
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return response;
        } catch (err) {
            setError(err.message);
            // Clear any stale data on login failure
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await api.register(userData);

            localStorage.setItem('token', response.token);
            
            // Get user data from token or fetch current user
            const userDataResponse = await api.getCurrentUser();
            localStorage.setItem('user', JSON.stringify(userDataResponse));

            setUser(userDataResponse);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 