import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const registerPatient = (data) => API.post('/auth/register/patient', data);
export const registerDoctor = (data) => API.post('/auth/register/doctor', data);

// Doctors
export const getAllDoctors = () => API.get('/doctors');
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const getDoctorsBySpec = (spec) => API.get(`/doctors/specialization/${spec}`);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

// Patients
export const getAllPatients = () => API.get('/patients');
export const getPatientById = (id) => API.get(`/patients/${id}`);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

// Appointments
export const bookAppointment = (data) => API.post('/appointments/book', data);
export const getPatientAppointments = (id) => API.get(`/appointments/patient/${id}`);
export const getDoctorAppointments = (id) => API.get(`/appointments/doctor/${id}`);
export const getAllAppointments = () => API.get('/appointments/all');
export const updateAppointmentStatus = (id, status) => API.put(`/appointments/${id}/status`, { status });
export const cancelAppointment = (id) => API.delete(`/appointments/${id}/cancel`);

// Billing
export const generateBill = (data) => API.post('/bills/generate', data);
export const payBill = (id) => API.put(`/bills/${id}/pay`);
export const getPatientBills = (id) => API.get(`/bills/patient/${id}`);
export const getAllBills = () => API.get('/bills/all');

export default API;
