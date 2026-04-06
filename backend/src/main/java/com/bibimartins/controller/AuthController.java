package com.bibimartins.controller;

import com.bibimartins.entity.User;
import com.bibimartins.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")  // React dev
public class AuthController {
    @Autowired
    private AuthService authService;

    // Honeypot field (campo invisível para bots)
    private static final String HONEYPOT_FIELD = "debug_mode";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> request, HttpServletRequest httpReq) {
        // Honeypot check (se preenchido, é bot -> dados falsos)
        if (request.contains
