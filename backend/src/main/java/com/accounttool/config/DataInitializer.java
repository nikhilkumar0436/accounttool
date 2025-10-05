package com.accounttool.config;

import com.accounttool.entity.User;
import com.accounttool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@accounttool.com");
            admin.setFullName("System Administrator");
            admin.setRole(User.UserRole.ADMIN);
            admin.setActive(true);
            
            userRepository.save(admin);
            System.out.println("Default admin user created. Username: admin, Password: admin123");
        }
    }
}
