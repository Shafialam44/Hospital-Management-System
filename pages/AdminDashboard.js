import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllDoctors, getAllPatients, getAllAppointments, getAllBills,
  deleteDoctor, deletePatient, generateBill, payBill, updateAppointmentStatus
} from '../services/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [billForm, setBillForm] = useState({ appointmentId: '', medicineFee: '', otherCharges: '', paymentMethod: 'CASH' });

  const loadAll = async () => {
    try {
      const [d, p, a, b] = await Promise.all([getAllDoctors(), getAllPatients(), getAllAppointments(), getAllBills()]);
      setDoctors(d.data); setPatients(p.data); setAppointments(a.data); setBills(b.data);
    } catch {}
  };

  useEffect(() => { loadAll(); }, []);

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try { await deleteDoctor(id); toast.success('Doctor deleted'); loadAll(); } catch { toast.error('Failed'); }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try { await deletePatient(id); toast.success('Patient deleted'); loadAll(); } catch { toast.error('Failed'); }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    try {
      await generateBill(billForm);
      toast.success('Bill generated!');
      setBillForm({ appointmentId: '', medicineFee: '', otherCharges: '', paymentMethod: 'CASH' });
      loadAll();
    } catch (err) { toast.error(err.response?.data || 'Failed'); }
  };

  const handlePayBill = async (id) => {
    try { await payBill(id); toast.success('Bill marked as paid'); loadAll(); } catch { toast.error('Failed'); }
  };

  const tabStyle = (t) => ({
    padding: '10px 20px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: 600,
    background: tab === t ? '#1a73e8' : '#e8f0fe', color: tab === t ? 'white' : '#1a73e8'
  });

  return (
    <div>
      <div className="welcome-banner">
        <h1>Admin Dashboard 🛡️</h1>
        <p>Manage doctors, patients, appointments and billing</p>
      </div>

      {/* Overview Stats */}
      <div className="dashboard-grid">
        <div className="stat-card blue"><div className="stat-number">{doctors.length}</div><div className="stat-label">Total Doctors</div></div>
        <div className="stat-card green"><div className="stat-number">{patients.length}</div><div className="stat-label">Total Patients</div></div>
        <div className="stat-card orange"><div className="stat-number">{appointments.length}</div><div className="stat-label">Total Appointments</div></div>
        <div className="stat-card red"><div className="stat-number">₹{bills.filter(b=>b.paymentStatus==='PAID').reduce((s,b)=>s+b.totalAmount,0).toFixed(0)}</div><div className="stat-label">Revenue Collected</div></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '-1px' }}>
        {[['overview','📊 Overview'],['doctors','👨‍⚕️ Doctors'],['patients','🤒 Patients'],['appointments','📅 Appointments'],['billing','💰 Billing']].map(([key,label]) => (
          <button key={key} style={tabStyle(key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ borderRadius: '0 12px 12px 12px' }}>
        {/* Doctors Tab */}
        {tab === 'doctors' && (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Specialization</th><th>Department</th><th>Fee</th><th>Experience</th><th>Action</th></tr></thead>
              <tbody>
                {doctors.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i+1}</td>
                    <td><strong>Dr. {d.name}</strong><br /><small>{d.email}</small></td>
                    <td>{d.specialization}</td>
                    <td>{d.department}</td>
                    <td>₹{d.consultationFee}</td>
                    <td>{d.experienceYears} yrs</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoctor(d.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Patients Tab */}
        {tab === 'patients' && (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>Blood Group</th><th>Action</th></tr></thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i+1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.gender}</td>
                    <td>{p.bloodGroup}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeletePatient(p.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i+1}</td>
                    <td>{a.patient?.name}</td>
                    <td>Dr. {a.doctor?.name}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.appointmentTime}</td>
                    <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                    <td style={{ display: 'flex', gap: 4 }}>
                      {a.status === 'PENDING' && <button className="btn btn-success btn-sm" onClick={() => updateAppointmentStatus(a.id,'CONFIRMED').then(loadAll)}>Confirm</button>}
                      {a.status === 'CONFIRMED' && <button className="btn btn-primary btn-sm" onClick={() => updateAppointmentStatus(a.id,'COMPLETED').then(loadAll)}>Complete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Billing Tab */}
        {tab === 'billing' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ marginBottom: 16, color: '#1a73e8' }}>Generate Bill</h3>
              <form onSubmit={handleGenerateBill}>
                <div className="form-group">
                  <label>Select Completed Appointment</label>
                  <select required value={billForm.appointmentId} onChange={e => setBillForm({...billForm, appointmentId: e.target.value})}>
                    <option value="">Select appointment</option>
                    {appointments.filter(a => a.status === 'COMPLETED').map(a => (
                      <option key={a.id} value={a.id}>
                        {a.patient?.name} – Dr. {a.doctor?.name} ({a.appointmentDate})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Medicine Fee (₹)</label>
                  <input type="number" placeholder="0" value={billForm.medicineFee}
                    onChange={e => setBillForm({...billForm, medicineFee: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Other Charges (₹)</label>
                  <input type="number" placeholder="0" value={billForm.otherCharges}
                    onChange={e => setBillForm({...billForm, otherCharges: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={billForm.paymentMethod} onChange={e => setBillForm({...billForm, paymentMethod: e.target.value})}>
                    <option>CASH</option><option>CARD</option><option>UPI</option><option>ONLINE</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-full">Generate Bill</button>
              </form>
            </div>

            <div>
              <h3 style={{ marginBottom: 16, color: '#1a73e8' }}>All Bills</h3>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <table>
                  <thead><tr><th>Patient</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bills.map(b => (
                      <tr key={b.id}>
                        <td>{b.appointment?.patient?.name}</td>
                        <td>₹{b.totalAmount}</td>
                        <td><span className={`badge badge-${b.paymentStatus?.toLowerCase()}`}>{b.paymentStatus}</span></td>
                        <td>{b.paymentStatus === 'PENDING' && <button className="btn btn-success btn-sm" onClick={() => handlePayBill(b.id)}>Mark Paid</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'overview' && (
          <div style={{ padding: 10 }}>
            <h3 style={{ color: '#1a73e8', marginBottom: 16 }}>System Overview</h3>
            <p>Use the tabs above to manage Doctors, Patients, Appointments, and Billing.</p>
            <div style={{ marginTop: 20, padding: 16, background: '#f0f4f8', borderRadius: 10 }}>
              <strong>Quick Summary:</strong>
              <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                <li>{doctors.length} doctors registered</li>
                <li>{patients.length} patients registered</li>
                <li>{appointments.filter(a=>a.status==='PENDING').length} pending appointments</li>
                <li>{bills.filter(b=>b.paymentStatus==='PENDING').length} unpaid bills</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
