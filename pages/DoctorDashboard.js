import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    getDoctorAppointments(user.userId).then(r => setAppointments(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Status updated to ${status}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.appointmentDate === today).length;

  return (
    <div>
      <div className="welcome-banner">
        <h1>Dr. {user?.name}'s Dashboard 👨‍⚕️</h1>
        <p>Manage your patient appointments efficiently</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card blue">
          <div className="stat-number">{appointments.length}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{todayCount}</div>
          <div className="stat-label">Today's Appointments</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{appointments.filter(a => a.status === 'COMPLETED').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{appointments.filter(a => a.status === 'PENDING').length}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">📋 My Appointments</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : ''}`}
              style={filter !== s ? { background: '#e8f0fe', color: '#1a73e8' } : {}}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="no-data">No appointments</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td><strong>{a.patient?.name}</strong><br /><small>{a.patient?.phone}</small></td>
                  <td>{a.appointmentDate}</td>
                  <td>{a.appointmentTime}</td>
                  <td style={{ maxWidth: 150 }}>{a.symptoms || '--'}</td>
                  <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                  <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {a.status === 'PENDING' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleStatus(a.id, 'CONFIRMED')}>Confirm</button>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleStatus(a.id, 'COMPLETED')}>Complete</button>
                    )}
                    {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleStatus(a.id, 'CANCELLED')}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
