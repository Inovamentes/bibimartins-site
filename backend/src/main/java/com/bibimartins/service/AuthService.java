package com.bibimartins.service;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final Argon2PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 65536, 10);
    private final Map<String, LoginAttempt> loginAttempts = new ConcurrentHashMap<>();

    // Inner class to track rate limiting state per key
    private static class LoginAttempt {
        int count = 0;
        LocalDateTime firstAttempt = LocalDateTime.now();
        LocalDateTime lockedUntil = null;
    }

    @Transactional
    public String registerOrLogin(String email, String password, boolean isAdmin) {
        String key = email.toLowerCase();

        // Rate limiting check
        checkRateLimit(key);

        Optional<User> existing = userRepository.findByEmail(key);

        if (existing.isPresent()) {
            // Login path: validate password
            User user = existing.get();
            if (!argon2.matches(password, user.getPassword())) {
                recordFailedAttempt(key);
                throw new RuntimeException("Invalid credentials");
            }
            resetAttempts(key);
            return user.isAdmin() ? "ADMIN" : "CLIENT";
        } else {
            // Register path: create new user
            if (!isPasswordValid(password)) {
                throw new RuntimeException("Password does not meet requirements");
            }
            User user = new User();
            user.setEmail(key);
            user.setPassword(argon2.encode(password));
            user.setAdmin(isAdmin);
            userRepository.save(user);
            return isAdmin ? "ADMIN" : "CLIENT";
        }
    }

    private void checkRateLimit(String key) {
        LoginAttempt attempt = loginAttempts.get(key);
        if (attempt == null) {
            return;
        }
        // Check hard lockout (30 min after 10 failures)
        if (attempt.lockedUntil != null && LocalDateTime.now().isBefore(attempt.lockedUntil)) {
            throw new RuntimeException("Account temporarily locked. Try again later.");
        }
        // Reset window after 5 minutes
        if (ChronoUnit.MINUTES.between(attempt.firstAttempt, LocalDateTime.now()) >= 5) {
            loginAttempts.remove(key);
            return;
        }
        // Soft limit: 5 attempts per 5-minute window
        if (attempt.count >= 5) {
            throw new RuntimeException("Too many attempts. Please wait before trying again.");
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
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasUpper && hasDigit;
    }
}
