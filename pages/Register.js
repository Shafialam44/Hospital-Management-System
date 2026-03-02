import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerPatient, registerDoctor } from '../services/api';

const Register = () => {
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [patientForm, setPatientForm] = useState({
    name: '', email: '', password: '', phone: '',
    dateOfBirth: '', gender: '', address: '', bloodGroup: ''
  });

  const [doctorForm, setDoctorForm] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', qualification: '', department: '',
    experienceYears: '', availableDays: '', availableTimeStart: '09:00',
    availableTimeEnd: '17:00', consultationFee: ''
  });

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerPatient(patientForm);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerDoctor({ ...doctorForm, experienceYears: parseInt(doctorForm.experienceYears), consultationFee: parseFloat(doctorForm.consultationFee) });
      toast.success('Doctor registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 650 }}>
      <div className="form-title">Create Account</div>
      <div className="form-subtitle">Join MediCare Hospital</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {['PATIENT', 'DOCTOR'].map(r => (
          <button key={r} type="button"
            className={`btn ${role === r ? 'btn-primary' : ''}`}
            style={role !== r ? { background: '#e8f0fe', color: '#1a73e8', flex: 1 } : { flex: 1 }}
            onClick={() => setRole(r)}>
            {r === 'PATIENT' ? '🤒 Register as Patient' : '👨‍⚕️ Register as Doctor'}
          </button>
        ))}
      </div>

      {role === 'PATIENT' && (
        <form onSubmit={handlePatientSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input required placeholder="John Doe" value={patientForm.name}
                onChange={e => setPatientForm({ ...patientForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="john@email.com" value={patientForm.email}
                onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="Min 6 characters" value={patientForm.password}
                onChange={e => setPatientForm({ ...patientForm, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="9876543210" value={patientForm.phone}
                onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={patientForm.dateOfBirth}
                onChange={e => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Blood Group</label>
              <select value={patientForm.bloodGroup} onChange={e => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input placeholder="City, State" value={patientForm.address}
                onChange={e => setPatientForm({ ...patientForm, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Patient'}
          </button>
        </form>
      )}

      {role === 'DOCTOR' && (
        <form onSubmit={handleDoctorSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input required placeholder="Dr. Ramesh Kumar" value={doctorForm.name}
                onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="dr.ramesh@email.com" value={doctorForm.email}
                onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={doctorForm.password}
                onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="9876543210" value={doctorForm.phone}
                onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Specialization</label>
              <select value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}>
                <option value="">Select</option>
                {['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','General Medicine','ENT','Gynecology','Ophthalmology'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input placeholder="Cardiology" value={doctorForm.department}
                onChange={e => setDoctorForm({ ...doctorForm, department: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Qualification</label>
              <input placeholder="MBBS, MD" value={doctorForm.qualification}
                onChange={e => setDoctorForm({ ...doctorForm, qualification: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input type="number" placeholder="5" value={doctorForm.experienceYears}
                onChange={e => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Available Days (e.g. MON,TUE,WED)</label>
              <input placeholder="MON,TUE,WED,THU,FRI" value={doctorForm.availableDays}
                onChange={e => setDoctorForm({ ...doctorForm, availableDays: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input type="number" placeholder="500" value={doctorForm.consultationFee}
                onChange={e => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Available From</label>
              <input type="time" value={doctorForm.availableTimeStart}
                onChange={e => setDoctorForm({ ...doctorForm, availableTimeStart: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Available To</label>
              <input type="time" value={doctorForm.availableTimeEnd}
                onChange={e => setDoctorForm({ ...doctorForm, availableTimeEnd: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Doctor'}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#1a73e8' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;
