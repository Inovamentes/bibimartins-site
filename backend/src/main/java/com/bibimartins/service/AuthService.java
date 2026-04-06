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
    private final Map<String, LoginAttempt> loginAttempts = new ConcurrentHashMap<>();  // Rate limiting in-memory

    @Transactional
    public String registerOrLogin(String email, String password, boolean isAdmin) {
        // Rate limiting: 5 tentativas/5min IP/email, lockout 30min após 10
        String key = email.toLowerCase();
        LoginAttempt attempt
