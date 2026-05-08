package com.bibimartins.controller;

import com.bibimartins.entity.User;
import com.bibimartins.entity.Plan;
import com.bibimartins.entity.UserSubscription;
import com.bibimartins.repository.UserRepository;
import com.bibimartins.repository.PlanRepository;
import com.bibimartins.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@org.springframework.transaction.annotation.Transactional
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers  = userRepository.count();
        long totalAdmins = userRepository.findAll().stream().filter(User::isAdmin).count();
        long totalClients = totalUsers - totalAdmins;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalClients", totalClients);
        stats.put("totalAdmins", totalAdmins);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("email", u.getEmail());
                map.put("role", u.isAdmin() ? "ADMIN" : "CLIENT");
                map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : "");
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
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Você não pode remover seu próprio acesso de Admin");
                    return ResponseEntity.badRequest().<Object>body(error);
                }
                user.setAdmin("ADMIN".equals(role));
            }
            
            userRepository.save(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuário atualizado com sucesso");
            return ResponseEntity.ok().<Object>body(response);
        }).orElse(ResponseEntity.notFound().<Object>build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication auth) {
        return userRepository.findById(id).map(user -> {
            if (user.getEmail().equals(auth.getName())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Você não pode se excluir");
                return ResponseEntity.badRequest().<Object>body(error);
            }
            userRepository.delete(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuário removido");
            return ResponseEntity.ok().<Object>body(response);
        }).orElse(ResponseEntity.notFound().<Object>build());
    }

    // --- SUBSCRIPTIONS ---

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;
    
    @Autowired
    private PlanRepository planRepository;

    @GetMapping("/subscriptions")
    public ResponseEntity<?> listSubscriptions() {
        List<Map<String, Object>> subs = subscriptionRepository.findAll().stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("userId", s.getUser().getId());
            m.put("userEmail", s.getUser().getEmail());
            m.put("planId", s.getPlan().getId());
            m.put("planName", s.getPlan().getName());
            m.put("active", s.isActive());
            m.put("createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : "");
            return m;
        }).toList();
        return ResponseEntity.ok(subs);
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<?> createSubscription(@RequestBody Map<String, Object> data) {
        Long userId = Long.parseLong(data.get("userId").toString());
        Long planId = Long.parseLong(data.get("planId").toString());
        
        User user = userRepository.findById(userId).orElseThrow();
        Plan plan = planRepository.findById(planId).orElseThrow();
        
        UserSubscription sub = new UserSubscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setActive(true);
        sub.setCreatedAt(java.time.LocalDateTime.now());
        
        UserSubscription saved = subscriptionRepository.save(sub);
        
        Map<String, Object> res = new HashMap<>();
        res.put("id", saved.getId());
        res.put("userEmail", user.getEmail());
        res.put("planName", plan.getName());
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        subscriptionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
