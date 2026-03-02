package com.example.hospital.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    private double consultationFee;
    private double medicineFee;
    private double otherCharges;
    private double totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime generatedAt;
    private String paymentMethod;

    public enum PaymentStatus {
        PENDING, PAID, CANCELLED
    }

    @PrePersist
    public void prePersist() {
        this.generatedAt = LocalDateTime.now();
        this.totalAmount = consultationFee + medicineFee + otherCharges;
        if (this.paymentStatus == null) this.paymentStatus = PaymentStatus.PENDING;
    }
}
