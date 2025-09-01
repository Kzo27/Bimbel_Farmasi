// src/components/AppWrapper.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Import semua halaman
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SubjectDetail from '../pages/SubjectDetail';
import ManageQuiz from '../pages/ManageQuiz';
import CreateTryOut from '../pages/CreateTryOut';
import ManageTryOuts from '../pages/ManageTryOuts';
import TryOutAnalytics from '../pages/TryOutAnalytics';
import ManageUsers from "../pages/ManageUsers";
import InfoManagement from '../pages/InfoManagement'; // <-- 1. IMPORT HALAMAN BARU

// Komponen PrivateRoute untuk melindungi rute yang butuh login
function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { token } = useContext(AuthContext);
  
  return (
    <Routes>
      {/* Rute Publik (Login) */}
      <Route 
        path="/login" 
        element={!token ? <Login /> : <Navigate to="/" />} 
      />
      
      {/* Rute Terproteksi menggunakan PrivateRoute */}
      <Route 
        path="/" 
        element={<PrivateRoute><Dashboard /></PrivateRoute>} 
      />
      <Route 
        path="/subject/:id" 
        element={<PrivateRoute><SubjectDetail /></PrivateRoute>} 
      />
      <Route 
        path="/quiz/:id" 
        element={<PrivateRoute><ManageQuiz /></PrivateRoute>} 
      />
      <Route 
        path="/create-tryout" 
        element={<PrivateRoute><CreateTryOut /></PrivateRoute>} 
      />
      <Route 
        path="/tryouts" 
        element={<PrivateRoute><ManageTryOuts /></PrivateRoute>} 
      />
      <Route 
        path="/tryout/:id/results" 
        element={<PrivateRoute><TryOutAnalytics /></PrivateRoute>}
      />
      <Route 
        path="/users" 
        element={<PrivateRoute><ManageUsers /></PrivateRoute>} 
      />

      {/* <-- 2. TAMBAHKAN RUTE BARU DI SINI --> */}
      <Route 
        path="/info" 
        element={<PrivateRoute><InfoManagement /></PrivateRoute>} 
      />
      
      {/* Fallback untuk path yang tidak ditemukan */}
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
    </Routes>
  );
}

export default AppRoutes;