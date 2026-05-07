package com.bibimartins.controller;

import com.bibimartins.entity.Course;
import com.bibimartins.entity.Lesson;
import com.bibimartins.entity.Plan;
import com.bibimartins.repository.CourseRepository;
import com.bibimartins.repository.LessonRepository;
import com.bibimartins.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/courses")
public class CourseAdminController {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    // --- PLANS ---
    
    @GetMapping("/plans")
    public ResponseEntity<List<Plan>> listPlans() {
        return ResponseEntity.ok(planRepository.findAll());
    }

    @PostMapping("/plans")
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        return ResponseEntity.ok(planRepository.save(plan));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan planDetails) {
        return planRepository.findById(id).map(plan -> {
            plan.setName(planDetails.getName());
            plan.setDescription(planDetails.getDescription());
            plan.setPrice(planDetails.getPrice());
            // Note: Manage courses separately or here? Let's allow updating the set of courses.
            plan.setCourses(planDetails.getCourses());
            return ResponseEntity.ok(planRepository.save(plan));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        return planRepository.findById(id).map(plan -> {
            planRepository.delete(plan);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- COURSES ---

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listCourses() {
        List<Map<String, Object>> courses = courseRepository.findAll().stream()
            .map(c -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", c.getId());
                m.put("title", c.getTitle());
                m.put("description", c.getDescription());
                m.put("thumbnailUrl", c.getThumbnailUrl());
                m.put("previewVideoUrl", c.getPreviewVideoUrl());
                m.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setThumbnailUrl(courseDetails.getThumbnailUrl());
            course.setPreviewVideoUrl(courseDetails.getPreviewVideoUrl());
            return ResponseEntity.ok(courseRepository.save(course));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            courseRepository.delete(course);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- LESSONS ---

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> listLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId));
    }

    @PostMapping("/{courseId}/lessons")
    public ResponseEntity<?> createLesson(@PathVariable Long courseId, @RequestBody Lesson lesson) {
        return courseRepository.findById(courseId).map(course -> {
            lesson.setCourse(course);
            return ResponseEntity.ok(lessonRepository.save(lesson));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long lessonId, @RequestBody Lesson lessonDetails) {
        return lessonRepository.findById(lessonId).map(lesson -> {
            lesson.setTitle(lessonDetails.getTitle());
            lesson.setDescription(lessonDetails.getDescription());
            lesson.setVideoUrl(lessonDetails.getVideoUrl());
            lesson.setAttachmentUrl(lessonDetails.getAttachmentUrl());
            lesson.setOrderIndex(lessonDetails.getOrderIndex());
            return ResponseEntity.ok(lessonRepository.save(lesson));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long lessonId) {
        return lessonRepository.findById(lessonId).map(lesson -> {
            lessonRepository.delete(lesson);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
