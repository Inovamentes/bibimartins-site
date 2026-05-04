package com.bibimartins.service;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final Argon2PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 65536, 10);
    private final Map<String, LoginAttempt> loginAttempts = new ConcurrentHashMap<>();

    private static class LoginAttempt {
        int count = 0;
        LocalDateTime firstAttempt = LocalDateTime.now();
        LocalDateTime lockedUntil = null;
    }

    @Transactional
    public String login(String email, String password) {
        String key = email.toLowerCase();
        checkRateLimit(key);

        Optional<User> existing = userRepository.findByEmail(key);
        if (existing.isEmpty()) {
            recordFailedAttempt(key);
            throw new RuntimeException("Credenciais inválidas");
        }

        User user = existing.get();
        if (!argon2.matches(password, user.getPassword())) {
            recordFailedAttempt(key);
            throw new RuntimeException("Credenciais inválidas");
        }

        resetAttempts(key);
        return user.isAdmin() ? "ADMIN" : "CLIENT";
    }

    @Transactional
    public String register(String email, String password) {
        String key = email.toLowerCase();

        if (userRepository.findByEmail(key).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        if (!isPasswordValid(password)) {
            throw new RuntimeException("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número");
        }

        User user = new User();
        user.setEmail(key);
        user.setPassword(argon2.encode(password));
        user.setAdmin(false);
        userRepository.save(user);
        return "CLIENT";
    }

    private void checkRateLimit(String key) {
        LoginAttempt attempt = loginAttempts.get(key);
        if (attempt == null) return;
        if (attempt.lockedUntil != null && LocalDateTime.now().isBefore(attempt.lockedUntil)) {
            throw new RuntimeException("Conta temporariamente bloqueada. Tente novamente mais tarde.");
        }
        if (ChronoUnit.MINUTES.between(attempt.firstAttempt, LocalDateTime.now()) >= 5) {
            loginAttempts.remove(key);
            return;
        }
        if (attempt.count >= 5) {
            throw new RuntimeException("Muitas tentativas. Aguarde antes de tentar novamente.");
        }
    }

    private void recordFailedAttempt(String key) {
        LoginAttempt attempt = loginAttempts.computeIfAbsent(key, k -> new LoginAttempt());
        attempt.count++;
        if (attempt.count >= 10) {
            attempt.lockedUntil = LocalDateTime.now().plusMinutes(30);
        }
    }

    private void resetAttempts(String key) {
        loginAttempts.remove(key);
    }

    private boolean isPasswordValid(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasUpper && hasDigit;
    }
}
