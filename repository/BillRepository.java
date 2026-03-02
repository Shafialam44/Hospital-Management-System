package com.example.hospital.repository;

import com.example.hospital.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByAppointmentId(Long appointmentId);
    List<Bill> findByAppointment_Patient_Id(Long patientId);
}
