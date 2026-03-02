import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPatientAppointments, cancelAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    getPatientAppointments(user.userId).then(r => setAppointments(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header">🗓️ My Appointments</div>

      <div className="card">
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
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="no-data">No appointments found</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td><strong>Dr. {a.doctor?.name}</strong></td>
                  <td>{a.doctor?.specialization}</td>
                  <td>{a.appointmentDate}</td>
                  <td>{a.appointmentTime}</td>
                  <td style={{ maxWidth: 150, wordBreak: 'break-word' }}>{a.symptoms || '--'}</td>
                  <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                  <td>
                    {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>Cancel</button>
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

export default MyAppointments;
