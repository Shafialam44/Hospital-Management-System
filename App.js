import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MyBills from './pages/MyBills';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  const homeRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'PATIENT') return <Navigate to="/patient/dashboard" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={homeRedirect()} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/book" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <BookAppointment />
        </ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <MyAppointments />
        </ProtectedRoute>
      } />
      <Route path="/patient/bills" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <MyBills />
        </ProtectedRoute>
      } />

      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <AppRoutes />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
