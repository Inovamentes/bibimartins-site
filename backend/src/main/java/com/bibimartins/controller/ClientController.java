package com.bibimartins.controller;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = {"http://localhost:5173", "https://bibimartins.com"})
public class ClientController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .map(u -> ResponseEntity.ok(Map.of(
                "id",        u.getId(),
                "email",     u.getEmail(),
                "role",      u.isAdmin() ? "ADMIN" : "CLIENT",
                "createdAt", u.getCreatedAt().toString()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body, Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .map(u -> {
                // Aqui futuramente podemos adicionar campos como nome, telefone, etc.
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Perfil atualizado com sucesso"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
