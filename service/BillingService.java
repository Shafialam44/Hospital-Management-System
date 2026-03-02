package com.example.hospital.service;

import com.example.hospital.model.*;
import com.example.hospital.model.Bill.PaymentStatus;
import com.example.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingService {

    @Autowired private BillRepository billRepository;
    @Autowired private AppointmentRepository appointmentRepository;

    public Bill generateBill(Long appointmentId, double medicineFee, double otherCharges, String paymentMethod) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (billRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new RuntimeException("Bill already generated for this appointment");
        }

        Bill bill = new Bill();
        bill.setAppointment(appointment);
        bill.setConsultationFee(appointment.getDoctor().getConsultationFee());
        bill.setMedicineFee(medicineFee);
        bill.setOtherCharges(otherCharges);
        bill.setPaymentMethod(paymentMethod);
        return billRepository.save(bill);
    }

    public Bill payBill(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        bill.setPaymentStatus(PaymentStatus.PAID);
        return billRepository.save(bill);
    }

    public List<Bill> getPatientBills(Long patientId) {
        return billRepository.findByAppointment_Patient_Id(patientId);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
}
