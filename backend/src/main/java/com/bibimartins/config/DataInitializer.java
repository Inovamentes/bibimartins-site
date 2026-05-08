package com.bibimartins.config;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired @Lazy
    private Argon2PasswordEncoder argon2;

    private static final String ADMIN_EMAIL    = "falacomigo@bibimartins.com";
    private static final String ADMIN_PASSWORD = "310412rsm";

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // ESTRATÉGIA DE ATUALIZAÇÃO: Garante que o admin exista e tenha a senha correta
        User admin = userRepository.findByEmail(ADMIN_EMAIL)
            .orElseGet(() -> {
                User u = new User();
                u.setEmail(ADMIN_EMAIL);
                u.setCreatedAt(java.time.LocalDateTime.now());
                return u;
            });

        admin.setPassword(argon2.encode("bibi123")); // SENHA TEMPORÁRIA
        admin.setAdmin(true);
        admin.setFullName("Bibi Martins");
        admin.setTermsAccepted(true);
        
        userRepository.save(admin);
        System.out.println("🚨 ADMIN RECOVERED - PASSWORD SET TO: bibi123");
    }
}
