package com.bibimartins.controller;

import com.bibimartins.entity.User;
import com.bibimartins.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .map(u -> {
                Map<String, Object> res = new HashMap<>();
                res.put("id", u.getId());
                res.put("email", u.getEmail());
                res.put("role", u.isAdmin() ? "ADMIN" : "CLIENT");
                res.put("createdAt", u.getCreatedAt().toString());
                res.put("fullName", u.getFullName() != null ? u.getFullName() : "");
                res.put("whatsapp", u.getWhatsapp() != null ? u.getWhatsapp() : "");
                res.put("documentType", u.getDocumentType() != null ? u.getDocumentType() : "");
                res.put("documentNumber", u.getDocumentNumber() != null ? u.getDocumentNumber() : "");
                res.put("companyName", u.getCompanyName() != null ? u.getCompanyName() : "");
                res.put("companyAddress", u.getCompanyAddress() != null ? u.getCompanyAddress() : "");
                res.put("copsoqUnlocked", u.isCopsoqUnlocked());
                res.put("hseUnlocked", u.isHseUnlocked());
                res.put("clinicalUnlocked", u.isClinicalUnlocked());
                return ResponseEntity.ok(res);
            })
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
                Map<String, String> res = new HashMap<>();
                res.put("message", "Perfil atualizado com sucesso");
                return ResponseEntity.ok(res);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
