package com.example.hospital.controller;

import com.example.hospital.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        try {
            Long appointmentId = Long.parseLong(body.get("appointmentId"));
            double medicineFee = Double.parseDouble(body.getOrDefault("medicineFee", "0"));
            double otherCharges = Double.parseDouble(body.getOrDefault("otherCharges", "0"));
            String paymentMethod = body.getOrDefault("paymentMethod", "CASH");
            return ResponseEntity.ok(billingService.generateBill(appointmentId, medicineFee, otherCharges, paymentMethod));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> pay(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(billingService.payBill(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> patientBills(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingService.getPatientBills(patientId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> allBills() {
        return ResponseEntity.ok(billingService.getAllBills());
    }
}
