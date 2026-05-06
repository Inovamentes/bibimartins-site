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

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client/courses")
@CrossOrigin(origins = {"http://localhost:5173", "https://bibimartins.com"})
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
            return Map.of(
                "id", course.getId(),
                "title", course.getTitle(),
                "description", course.getDescription() == null ? "" : course.getDescription(),
                "thumbnailUrl", course.getThumbnailUrl() == null ? "" : course.getThumbnailUrl(),
                "previewVideoUrl", course.getPreviewVideoUrl() == null ? "" : course.getPreviewVideoUrl(),
                "isUnlocked", isUnlocked
            );
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
                    .map(l -> Map.of(
                        "id", l.getId(),
                        "title", l.getTitle(),
                        "description", l.getDescription() == null ? "" : l.getDescription(),
                        "videoUrl", l.getVideoUrl() == null ? "" : l.getVideoUrl(),
                        "attachmentUrl", l.getAttachmentUrl() == null ? "" : l.getAttachmentUrl(),
                        "orderIndex", l.getOrderIndex()
                    )).toList();
                
                return ResponseEntity.ok(Map.of(
                    "id", course.getId(),
                    "title", course.getTitle(),
                    "description", course.getDescription(),
                    "thumbnailUrl", course.getThumbnailUrl(),
                    "isUnlocked", true,
                    "lessons", lessons
                ));
            } else {
                // If locked, return only basic info + preview
                return ResponseEntity.ok(Map.of(
                    "id", course.getId(),
                    "title", course.getTitle(),
                    "description", course.getDescription(),
                    "thumbnailUrl", course.getThumbnailUrl(),
                    "previewVideoUrl", course.getPreviewVideoUrl(),
                    "isUnlocked", false,
                    "message", "Este curso está bloqueado. Adquira um plano para acessar."
                ));
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
