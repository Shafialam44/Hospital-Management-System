import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHospital } from 'react-icons/fa';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '/patient/book', label: 'Book Appointment' },
    { to: '/patient/appointments', label: 'My Appointments' },
    { to: '/patient/bills', label: 'My Bills' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
  ];

  const links = user?.role === 'PATIENT' ? patientLinks
    : user?.role === 'DOCTOR' ? doctorLinks
    : user?.role === 'ADMIN' ? adminLinks : [];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FaHospital size={22} />
        MediCare Hospital
      </Link>

      {user && (
        <ul className="navbar-links">
          {links.map(link => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          <li>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              👤 {user.name}
            </span>
          </li>
          <li>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}

      {!user && (
        <ul className="navbar-links">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
