package com.bibimartins.controller;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "https://bibimartins.com"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers  = userRepository.count();
        long totalAdmins = userRepository.findAll().stream().filter(User::isAdmin).count();
        long totalClients = totalUsers - totalAdmins;

        return ResponseEntity.ok(Map.of(
            "totalUsers",   totalUsers,
            "totalClients", totalClients,
            "totalAdmins",  totalAdmins
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(u -> Map.<String, Object>of(
                "id",        u.getId(),
                "email",     u.getEmail(),
                "role",      u.isAdmin() ? "ADMIN" : "CLIENT",
                "createdAt", u.getCreatedAt().toString()
            ))
            .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication auth) {
        return userRepository.findById(id).map(user -> {
            if (user.getEmail().equals(auth.getName())) {
                return ResponseEntity.badRequest()
                    .<Object>body(Map.of("error", "Você não pode se excluir"));
            }
            userRepository.delete(user);
            return ResponseEntity.ok().<Object>body(Map.of("message", "Usuário removido"));
        }).orElse(ResponseEntity.notFound().<Object>build());
    }
}
