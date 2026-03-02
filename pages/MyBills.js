import React, { useState, useEffect } from 'react';
import { getPatientBills } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBills = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);

  useEffect(() => {
    getPatientBills(user.userId).then(r => setBills(r.data)).catch(() => {});
  }, []);

  const totalPaid = bills.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + b.totalAmount, 0);
  const totalPending = bills.filter(b => b.paymentStatus === 'PENDING').reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div>
      <div className="page-header">💰 My Bills</div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="stat-number">₹{totalPaid.toFixed(0)}</div>
          <div className="stat-label">Total Paid</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">₹{totalPending.toFixed(0)}</div>
          <div className="stat-label">Total Pending</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-number">{bills.length}</div>
          <div className="stat-label">Total Bills</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Billing History</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Consultation Fee</th>
                <th>Medicine Fee</th>
                <th>Other</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr><td colSpan={9} className="no-data">No bills found</td></tr>
              ) : bills.map((b, i) => (
                <tr key={b.id}>
                  <td>{i + 1}</td>
                  <td>Dr. {b.appointment?.doctor?.name}</td>
                  <td>{b.generatedAt?.split('T')[0]}</td>
                  <td>₹{b.consultationFee}</td>
                  <td>₹{b.medicineFee}</td>
                  <td>₹{b.otherCharges}</td>
                  <td><strong>₹{b.totalAmount}</strong></td>
                  <td>{b.paymentMethod}</td>
                  <td><span className={`badge badge-${b.paymentStatus?.toLowerCase()}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBills;
