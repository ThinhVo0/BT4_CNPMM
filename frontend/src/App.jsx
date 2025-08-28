import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './components/context/auth.context.jsx';
import Header from './components/layout/header.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';

const App = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;