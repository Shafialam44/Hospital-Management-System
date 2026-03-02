package com.example.hospital.repository;

import com.example.hospital.model.Appointment;
import com.example.hospital.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.appointmentTime = :time AND a.status != 'CANCELLED'")
    List<Appointment> findConflict(Long doctorId, LocalDate date, LocalTime time);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
}
