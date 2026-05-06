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
            .map(u -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", u.getId());
                map.put("email", u.getEmail());
                map.put("role", u.isAdmin() ? "ADMIN" : "CLIENT");
                map.put("createdAt", u.getCreatedAt().toString());
                map.put("fullName", u.getFullName());
                map.put("whatsapp", u.getWhatsapp());
                map.put("documentType", u.getDocumentType());
                map.put("documentNumber", u.getDocumentNumber());
                map.put("companyName", u.getCompanyName());
                map.put("companyAddress", u.getCompanyAddress());
                return map;
            })
            .toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> data, Authentication auth) {
        return userRepository.findById(id).map(user -> {
            if (data.containsKey("fullName")) user.setFullName(data.get("fullName") == null ? null : data.get("fullName").toString());
            if (data.containsKey("whatsapp")) user.setWhatsapp(data.get("whatsapp") == null ? null : data.get("whatsapp").toString());
            if (data.containsKey("documentType")) user.setDocumentType(data.get("documentType") == null ? null : data.get("documentType").toString());
            if (data.containsKey("documentNumber")) user.setDocumentNumber(data.get("documentNumber") == null ? null : data.get("documentNumber").toString());
            if (data.containsKey("companyName")) user.setCompanyName(data.get("companyName") == null ? null : data.get("companyName").toString());
            if (data.containsKey("companyAddress")) user.setCompanyAddress(data.get("companyAddress") == null ? null : data.get("companyAddress").toString());
            
            if (data.containsKey("role")) {
                String role = data.get("role") == null ? "CLIENT" : data.get("role").toString();
                if (user.getEmail().equals(auth.getName()) && role.equals("CLIENT")) {
                    return ResponseEntity.badRequest().<Object>body(Map.of("error", "Você não pode remover seu próprio acesso de Admin"));
                }
                user.setAdmin("ADMIN".equals(role));
            }
            
            userRepository.save(user);
            return ResponseEntity.ok().<Object>body(Map.of("message", "Usuário atualizado com sucesso"));
        }).orElse(ResponseEntity.notFound().<Object>build());
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
