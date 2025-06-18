import React from 'react';
import { Navigate } from 'react-router-dom';

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute; 