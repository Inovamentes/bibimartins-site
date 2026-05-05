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
                "id",             u.getId(),
                "email",          u.getEmail(),
                "role",           u.isAdmin() ? "ADMIN" : "CLIENT",
                "createdAt",      u.getCreatedAt().toString(),
                "fullName",       u.getFullName() != null ? u.getFullName() : "",
                "whatsapp",       u.getWhatsapp() != null ? u.getWhatsapp() : "",
                "documentType",   u.getDocumentType() != null ? u.getDocumentType() : "",
                "documentNumber", u.getDocumentNumber() != null ? u.getDocumentNumber() : "",
                "companyName",    u.getCompanyName() != null ? u.getCompanyName() : "",
                "companyAddress", u.getCompanyAddress() != null ? u.getCompanyAddress() : ""
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body, Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .map(u -> {
                if (body.containsKey("fullName")) u.setFullName((String) body.get("fullName"));
                if (body.containsKey("whatsapp")) u.setWhatsapp((String) body.get("whatsapp"));
                if (body.containsKey("documentType")) u.setDocumentType((String) body.get("documentType"));
                if (body.containsKey("documentNumber")) u.setDocumentNumber((String) body.get("documentNumber"));
                if (body.containsKey("companyName")) u.setCompanyName((String) body.get("companyName"));
                if (body.containsKey("companyAddress")) u.setCompanyAddress((String) body.get("companyAddress"));

                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Perfil atualizado com sucesso"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
