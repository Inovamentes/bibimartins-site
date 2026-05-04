package com.bibimartins.config;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    private final Argon2PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 65536, 10);

    private static final String ADMIN_EMAIL    = "falacomigo@bibimartins.com";
    private static final String ADMIN_PASSWORD = "310412rsm";

    @Override
    public void run(ApplicationArguments args) {
        // Cria o admin somente se ainda não existir
        if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
            User admin = new User();
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(argon2.encode(ADMIN_PASSWORD));
            admin.setAdmin(true);
            userRepository.save(admin);
            System.out.println("✅ Admin criado: " + ADMIN_EMAIL);
        } else {
            System.out.println("ℹ️  Admin já existe: " + ADMIN_EMAIL);
        }
    }
}
