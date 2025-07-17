// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Auth from './components/Auth';
import './App.css';

// 👇 Wrapper để bảo vệ route
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </ConfigProvider>
  );
}

export default App;
