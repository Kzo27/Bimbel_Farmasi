import React, { createContext, useState } from 'react';
import axios from 'axios';

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Provider Component
const AuthProvider = ({ children }) => {
  // State untuk menyimpan token dan data user
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  // Fungsi untuk login
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;

      // Simpan token ke state dan localStorage
      setToken(token);
      localStorage.setItem('token', token);

      // (Opsional) Ambil data user setelah login
      // const userResponse = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      // setUser(userResponse.data.data);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };