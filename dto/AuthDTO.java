package com.example.hospital.dto;

import lombok.Data;
import java.time.LocalDate;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String role;
        private Long userId;
        private String name;
        private String email;
    }

    @Data
    public static class PatientRegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String bloodGroup;
    }

    @Data
    public static class DoctorRegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String specialization;
        private String qualification;
        private String department;
        private int experienceYears;
        private String availableDays;
        private String availableTimeStart;
        private String availableTimeEnd;
        private double consultationFee;
    }
}
