package com.bibimartins.controller;

import com.bibimartins.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Honeypot field name (invisible to real users, filled only by bots)
    private static final String HONEYPOT_FIELD = "debug_mode";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> request, HttpServletRequest httpReq) {
        // Honeypot check: if the hidden field is present and non-empty, silently reject the bot
        if (request.containsKey(HONEYPOT_FIELD) && request.get(HONEYPOT_FIELD) != null
                && !request.get(HONEYPOT_FIELD).toString().isBlank()) {
            // Return a plausible-looking fake success to confuse bots
            return ResponseEntity.ok(Map.of("role", "CLIENT", "message", "Login successful"));
        }

        String email = (String) request.get("email");
        String password = (String) request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        try {
            String role = authService.registerOrLogin(email, password, false);
            return ResponseEntity.ok(Map.of("role", role, "message", "Login successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request, HttpServletRequest httpReq) {
        // Honeypot check
        if (request.containsKey(HONEYPOT_FIELD) && request.get(HONEYPOT_FIELD) != null
                && !request.get(HONEYPOT_FIELD).toString().isBlank()) {
            return ResponseEntity.ok(Map.of("role", "CLIENT", "message", "Registration successful"));
        }

        String email = (String) request.get("email");
        String password = (String) request.get("password");
        boolean isAdmin = Boolean.TRUE.equals(request.get("isAdmin"));

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        try {
            String role = authService.registerOrLogin(email, password, isAdmin);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("role", role, "message", "Registration successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
