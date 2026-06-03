package com.bibimartins.controller;

import com.bibimartins.entity.Course;
import com.bibimartins.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/public/courses")
@Transactional
@CrossOrigin(origins = "*")
public class CoursePublicController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<?> listPublicCourses() {
        List<Map<String, Object>> list = courseRepository.findAll().stream().map(course -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", course.getId());
            item.put("title", course.getTitle());
            item.put("description", course.getDescription() == null ? "" : course.getDescription());
            item.put("thumbnailUrl", course.getThumbnailUrl() == null ? "" : course.getThumbnailUrl());
            item.put("previewVideoUrl", course.getPreviewVideoUrl() == null ? "" : course.getPreviewVideoUrl());
            return item;
        }).toList();

        return ResponseEntity.ok(list);
    }
}
