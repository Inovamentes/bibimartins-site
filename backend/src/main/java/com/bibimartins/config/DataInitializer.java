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
        // GARANTIA DE ADMIN: Cria se não existir, mas NÃO sobrescreve a senha se já existir
        userRepository.findByEmail(ADMIN_EMAIL).ifPresentOrElse(
            admin -> {
                // Garante que continue sendo admin mesmo que algo tenha mudado
                admin.setAdmin(true);
                userRepository.save(admin);
                System.out.println("✅ ADMIN VERIFIED: " + ADMIN_EMAIL);
            },
            () -> {
                // Se não existe, cria o primeiro acesso
                User admin = new User();
                admin.setEmail(ADMIN_EMAIL);
                admin.setPassword(argon2.encode("310412rsm")); // Set initial admin password as requested by user
                admin.setAdmin(true);
                admin.setFullName("Bibi Martins");
                admin.setTermsAccepted(true);
                admin.setCreatedAt(java.time.LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("🚀 INITIAL ADMIN CREATED: " + ADMIN_EMAIL);
            }
        );
    }
}
