import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPatientAppointments, getPatientBills } from '../services/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      getPatientAppointments(user.userId).then(r => setAppointments(r.data)).catch(() => {});
      getPatientBills(user.userId).then(r => setBills(r.data)).catch(() => {});
    }
  }, [user]);

  const pending = appointments.filter(a => a.status === 'PENDING').length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const unpaidBills = bills.filter(b => b.paymentStatus === 'PENDING').length;

  return (
    <div>
      <div className="welcome-banner">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Manage your appointments, view bills, and stay healthy.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card blue">
          <div className="stat-number">{appointments.length}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{unpaidBills}</div>
          <div className="stat-label">Unpaid Bills</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/patient/book" className="btn btn-primary">📅 Book New Appointment</Link>
            <Link to="/patient/appointments" className="btn btn-success">🗓️ View My Appointments</Link>
            <Link to="/patient/bills" className="btn btn-warning">💰 View My Bills</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">📋 Recent Appointments</div>
          {appointments.slice(0, 4).length === 0 ? (
            <p className="no-data">No appointments yet</p>
          ) : (
            appointments.slice(0, 4).map(a => (
              <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Dr. {a.doctor?.name}</strong>
                  <br /><small style={{ color: '#666' }}>{a.appointmentDate} at {a.appointmentTime}</small>
                </div>
                <span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
