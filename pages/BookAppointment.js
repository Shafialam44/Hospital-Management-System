import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllDoctors, bookAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [form, setForm] = useState({
    doctorId: '', date: '', time: '', symptoms: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllDoctors().then(r => setDoctors(r.data)).catch(() => toast.error('Failed to load doctors'));
  }, []);

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
  const filteredDoctors = selectedSpec ? doctors.filter(d => d.specialization === selectedSpec) : doctors;
  const selectedDoctor = doctors.find(d => d.id === parseInt(form.doctorId));

  const generateTimeSlots = () => {
    if (!selectedDoctor) return [];
    const slots = [];
    const start = selectedDoctor.availableTimeStart || '09:00';
    const end = selectedDoctor.availableTimeEnd || '17:00';
    let [h, m] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    while (h < eh || (h === eh && m < em)) {
      slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
      m += 30;
      if (m >= 60) { h++; m = 0; }
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookAppointment({
        patientId: String(user.userId),
        doctorId: form.doctorId,
        date: form.date,
        time: form.time + ':00',
        symptoms: form.symptoms
      });
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data || 'Slot already taken. Please choose another.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">📅 Book an Appointment</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">Select Doctor</div>
          <div className="form-group">
            <label>Filter by Specialization</label>
            <select value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)}>
              <option value="">All Specializations</option>
              {specializations.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ maxHeight: 350, overflowY: 'auto' }}>
            {filteredDoctors.map(doc => (
              <div key={doc.id}
                onClick={() => setForm({ ...form, doctorId: String(doc.id), time: '' })}
                style={{
                  padding: 14, marginBottom: 10, border: `2px solid ${form.doctorId == doc.id ? '#1a73e8' : '#e0e0e0'}`,
                  borderRadius: 10, cursor: 'pointer', background: form.doctorId == doc.id ? '#e8f0fe' : 'white',
                  transition: 'all 0.2s'
                }}>
                <div style={{ fontWeight: 600, color: '#1a73e8' }}>Dr. {doc.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#555', marginTop: 4 }}>
                  🩺 {doc.specialization} | {doc.qualification}<br />
                  💰 ₹{doc.consultationFee} | ⏰ {doc.availableTimeStart}–{doc.availableTimeEnd}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">Appointment Details</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Date</label>
              <input type="date" required min={new Date().toISOString().split('T')[0]}
                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>

            {selectedDoctor && form.date && (
              <div className="form-group">
                <label>Select Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {generateTimeSlots().map(slot => (
                    <div key={slot}
                      onClick={() => setForm({ ...form, time: slot })}
                      style={{
                        padding: '8px', textAlign: 'center', border: `2px solid ${form.time === slot ? '#1a73e8' : '#ddd'}`,
                        borderRadius: 6, cursor: 'pointer', background: form.time === slot ? '#1a73e8' : 'white',
                        color: form.time === slot ? 'white' : '#333', fontSize: '0.85rem', fontWeight: 600
                      }}>
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Symptoms / Reason for Visit</label>
              <textarea rows={3} placeholder="Describe your symptoms..."
                value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: 8, resize: 'vertical' }} />
            </div>

            {selectedDoctor && (
              <div style={{ background: '#f0f4f8', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.9rem' }}>
                <strong>Summary:</strong> Dr. {selectedDoctor.name} | {form.date || '--'} at {form.time || '--'}<br />
                <strong>Fee: ₹{selectedDoctor.consultationFee}</strong>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading || !form.doctorId || !form.time}>
              {loading ? 'Booking...' : '✅ Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
