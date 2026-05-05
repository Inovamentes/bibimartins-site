package com.bibimartins.config;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
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
    public void run(ApplicationArguments args) {
        // Sempre garante que o admin existe com a senha/hash corretos
        User admin = userRepository.findByEmail(ADMIN_EMAIL)
            .orElse(new User());

        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(argon2.encode(ADMIN_PASSWORD)); // re-hash com params atuais
        admin.setAdmin(true);
        userRepository.save(admin);

        System.out.println("✅ Admin sincronizado: " + ADMIN_EMAIL);
    }
}
