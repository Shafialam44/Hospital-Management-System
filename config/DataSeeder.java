package com.example.hospital.config;

import com.example.hospital.model.User;
import com.example.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("admin@hospital.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@hospital.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setPhone("9999999999");
            userRepository.save(admin);
            System.out.println("Default admin created: admin@hospital.com / admin123");
        }
    }
}
