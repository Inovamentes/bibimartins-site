package com.bibimartins.controller;

import com.bibimartins.config.JwtUtil;
import com.bibimartins.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://bibimartins.com"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final String HONEYPOT_FIELD = "debug_mode";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> request) {
        if (isBot(request)) {
            return ResponseEntity.ok(Map.of("token", "fake-token", "role", "CLIENT"));
        }

        String email    = (String) request.get("email");
        String password = (String) request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email e senha são obrigatórios"));
        }

        try {
            String role  = authService.login(email, password);
            String token = jwtUtil.generateToken(email.toLowerCase(), role);
            return ResponseEntity.ok(Map.of("token", token, "role", role, "email", email.toLowerCase()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        if (isBot(request)) {
            return ResponseEntity.ok(Map.of("token", "fake-token", "role", "CLIENT"));
        }

        String email    = (String) request.get("email");
        String password = (String) request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email e senha são obrigatórios"));
        }

        try {
            String role  = authService.register(email, password);
            String token = jwtUtil.generateToken(email.toLowerCase(), role);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("token", token, "role", role, "email", email.toLowerCase()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private boolean isBot(Map<String, Object> request) {
        return request.containsKey(HONEYPOT_FIELD) &&
               request.get(HONEYPOT_FIELD) != null &&
               !request.get(HONEYPOT_FIELD).toString().isBlank();
    }
}
