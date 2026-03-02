package com.example.hospital.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id")
public class Doctor extends User {

    private String specialization;
    private String qualification;
    private String department;
    private int experienceYears;
    private String availableDays;       // e.g., "MON,TUE,WED"
    private String availableTimeStart;  // e.g., "09:00"
    private String availableTimeEnd;    // e.g., "17:00"
    private double consultationFee;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;
}
