package com.bibimartins.controller;

import com.bibimartins.config.JwtUtil;
import com.bibimartins.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

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
            Map<String, String> botRes = new HashMap<>();
            botRes.put("token", "fake-token");
            botRes.put("role", "CLIENT");
            return ResponseEntity.ok(botRes);
        }

        String email    = (String) request.get("email");
        String password = (String) request.get("password");

        if (email == null || password == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Email e senha são obrigatórios");
            return ResponseEntity.badRequest().body(err);
        }

        try {
            String role  = authService.login(email, password);
            String token = jwtUtil.generateToken(email.toLowerCase(), role);
            Map<String, String> res = new HashMap<>();
            res.put("token", token);
            res.put("role", role);
            res.put("email", email.toLowerCase());
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        if (isBot(request)) {
            Map<String, String> botRes = new HashMap<>();
            botRes.put("token", "fake-token");
            botRes.put("role", "CLIENT");
            return ResponseEntity.ok(botRes);
        }

        String email    = (String) request.get("email");
        String password = (String) request.get("password");
        String fullName = (String) request.get("fullName");
        String whatsapp = (String) request.get("whatsapp");
        String documentType = (String) request.get("documentType");
        String documentNumber = (String) request.get("documentNumber");
        String companyName = (String) request.get("companyName");
        String companyAddress = (String) request.get("companyAddress");
        Boolean termsAccepted = (Boolean) request.get("termsAccepted");

        if (email == null || password == null || fullName == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Nome, Email e senha são obrigatórios");
            return ResponseEntity.badRequest().body(err);
        }

        try {
            String role  = authService.register(email, password, fullName, whatsapp, documentType, documentNumber, companyName, companyAddress, termsAccepted);
            String token = jwtUtil.generateToken(email.toLowerCase(), role);
            Map<String, String> res = new HashMap<>();
            res.put("token", token);
            res.put("role", role);
            res.put("email", email.toLowerCase());
            res.put("fullName", fullName);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (RuntimeException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        try {
            String email = jwtUtil.extractEmail(token);
            if (jwtUtil.isValid(token)) {
                return authService.getUserByEmail(email)
                    .map(user -> {
                        Map<String, String> res = new HashMap<>();
                        res.put("email", user.getEmail());
                        res.put("role", user.isAdmin() ? "ADMIN" : "CLIENT");
                        res.put("fullName", user.getFullName() != null ? user.getFullName() : "");
                        return ResponseEntity.ok(res);
                    })
                    .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    private boolean isBot(Map<String, Object> request) {
        return request.containsKey(HONEYPOT_FIELD) &&
               request.get(HONEYPOT_FIELD) != null &&
               !request.get(HONEYPOT_FIELD).toString().isBlank();
    }
}
