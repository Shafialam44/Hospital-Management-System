package com.example.hospital.controller;

import com.example.hospital.model.Doctor;
import com.example.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specialization/{spec}")
    public ResponseEntity<?> bySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(doctorRepository.findBySpecialization(spec));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(doc -> {
            doc.setSpecialization(updatedDoctor.getSpecialization());
            doc.setDepartment(updatedDoctor.getDepartment());
            doc.setAvailableDays(updatedDoctor.getAvailableDays());
            doc.setAvailableTimeStart(updatedDoctor.getAvailableTimeStart());
            doc.setAvailableTimeEnd(updatedDoctor.getAvailableTimeEnd());
            doc.setConsultationFee(updatedDoctor.getConsultationFee());
            return ResponseEntity.ok(doctorRepository.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok("Doctor deleted");
    }
}
