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
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/courses")
@org.springframework.transaction.annotation.Transactional
public class CourseAdminController {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    // --- PLANS ---
    
    @GetMapping("/plans")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> listPlans() {
        List<Map<String, Object>> plans = planRepository.findAll().stream()
            .map(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", p.getId());
                m.put("name", p.getName());
                m.put("description", p.getDescription());
                m.put("price", p.getPrice());
                m.put("durationMonths", p.getDurationMonths());
                
                
                List<Map<String, Object>> pCourses = p.getCourses().stream()
                    .map(c -> {
                        Map<String, Object> cm = new HashMap<>();
                        cm.put("id", c.getId());
                        cm.put("title", c.getTitle());
                        return cm;
                    }).toList();
                
                m.put("courses", pCourses);
                return m;
            }).toList();
        return ResponseEntity.ok(plans);
    }

    @PostMapping("/plans")
    public ResponseEntity<Plan> createPlan(@RequestBody Map<String, Object> data) {
        Plan plan = new Plan();
        plan.setName(data.get("name").toString());
        plan.setDescription(data.get("description") != null ? data.get("description").toString() : "");
        plan.setPrice(Double.parseDouble(data.get("price").toString()));
        if (data.containsKey("durationMonths") && data.get("durationMonths") != null) {
            plan.setDurationMonths(Integer.parseInt(data.get("durationMonths").toString()));
        }
        
        if (data.containsKey("courses")) {
            List<Map<String, Object>> courseData = (List<Map<String, Object>>) data.get("courses");
            java.util.Set<Course> courses = new java.util.HashSet<>();
            for (Map<String, Object> cd : courseData) {
                courseRepository.findById(Long.parseLong(cd.get("id").toString())).ifPresent(courses::add);
            }
            plan.setCourses(courses);
        }
        
        return ResponseEntity.ok(planRepository.save(plan));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return planRepository.findById(id).map(plan -> {
            if (data.containsKey("name")) plan.setName(data.get("name").toString());
            if (data.containsKey("description")) plan.setDescription(data.get("description").toString());
            if (data.containsKey("price")) plan.setPrice(Double.parseDouble(data.get("price").toString()));
            if (data.containsKey("durationMonths") && data.get("durationMonths") != null) plan.setDurationMonths(Integer.parseInt(data.get("durationMonths").toString()));
            
            if (data.containsKey("courses")) {
                List<Map<String, Object>> courseData = (List<Map<String, Object>>) data.get("courses");
                java.util.Set<Course> courses = new java.util.HashSet<>();
                for (Map<String, Object> cd : courseData) {
                    courseRepository.findById(Long.parseLong(cd.get("id").toString())).ifPresent(courses::add);
                }
                plan.setCourses(courses);
            }
            
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
            course.getPlans().forEach(plan -> {
                plan.getCourses().remove(course);
                planRepository.save(plan);
            });
            courseRepository.delete(course);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- LESSONS ---

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Map<String, Object>>> listLessons(@PathVariable Long courseId) {
        List<Map<String, Object>> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
            .map(l -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", l.getId());
                m.put("title", l.getTitle());
                m.put("description", l.getDescription());
                m.put("videoUrl", l.getVideoUrl());
                m.put("attachmentUrl", l.getAttachmentUrl());
                m.put("orderIndex", l.getOrderIndex());
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(lessons);
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
