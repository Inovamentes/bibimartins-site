package com.bibimartins.controller;

import com.bibimartins.entity.Course;
import com.bibimartins.entity.Plan;
import com.bibimartins.entity.User;
import com.bibimartins.entity.UserSubscription;
import com.bibimartins.repository.CourseRepository;
import com.bibimartins.repository.PlanRepository;
import com.bibimartins.repository.UserRepository;
import com.bibimartins.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client/courses")
@Transactional
public class CourseClientController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @GetMapping("/catalog")
    public ResponseEntity<?> getCatalog(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        // Find all active subscriptions for the user
        List<UserSubscription> subscriptions = subscriptionRepository.findByUserIdAndActiveTrue(user.getId());
        
        // Collect all course IDs the user has access to
        Set<Long> unlockedCourseIds = subscriptions.stream()
            .map(UserSubscription::getPlan)
            .flatMap(plan -> plan.getCourses().stream())
            .map(Course::getId)
            .collect(Collectors.toSet());

        List<Map<String, Object>> catalog = courseRepository.findAll().stream().map(course -> {
            boolean isUnlocked = unlockedCourseIds.contains(course.getId());
            Map<String, Object> item = new HashMap<>();
            item.put("id", course.getId());
            item.put("title", course.getTitle());
            item.put("description", course.getDescription() == null ? "" : course.getDescription());
            item.put("thumbnailUrl", course.getThumbnailUrl() == null ? "" : course.getThumbnailUrl());
            item.put("previewVideoUrl", course.getPreviewVideoUrl() == null ? "" : course.getPreviewVideoUrl());
            item.put("isUnlocked", isUnlocked);
            return item;
        }).toList();

        return ResponseEntity.ok(catalog);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseDetails(@PathVariable Long courseId, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        List<UserSubscription> subscriptions = subscriptionRepository.findByUserIdAndActiveTrue(user.getId());
        Set<Long> unlockedCourseIds = subscriptions.stream()
            .map(UserSubscription::getPlan)
            .flatMap(plan -> plan.getCourses().stream())
            .map(Course::getId)
            .collect(Collectors.toSet());

        return courseRepository.findById(courseId).map(course -> {
            boolean isUnlocked = unlockedCourseIds.contains(course.getId());
            
            // If unlocked, return full details including lessons
            if (isUnlocked) {
                var lessons = course.getLessons().stream()
                    .map(l -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", l.getId());
                        m.put("title", l.getTitle());
                        m.put("description", l.getDescription() == null ? "" : l.getDescription());
                        m.put("videoUrl", l.getVideoUrl() == null ? "" : l.getVideoUrl());
                        m.put("attachmentUrl", l.getAttachmentUrl() == null ? "" : l.getAttachmentUrl());
                        m.put("orderIndex", l.getOrderIndex());
                        return m;
                    }).toList();
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", course.getId());
                response.put("title", course.getTitle());
                response.put("description", course.getDescription());
                response.put("thumbnailUrl", course.getThumbnailUrl());
                response.put("isUnlocked", true);
                response.put("lessons", lessons);
                return ResponseEntity.ok(response);
            } else {
                // If locked, return only basic info + preview
                Map<String, Object> response = new HashMap<>();
                response.put("id", course.getId());
                response.put("title", course.getTitle());
                response.put("description", course.getDescription());
                response.put("thumbnailUrl", course.getThumbnailUrl());
                response.put("previewVideoUrl", course.getPreviewVideoUrl());
                response.put("isUnlocked", false);
                response.put("message", "Este curso está bloqueado. Adquira um plano para acessar.");
                return ResponseEntity.ok(response);
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
