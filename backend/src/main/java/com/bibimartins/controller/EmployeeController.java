package com.bibimartins.controller;

import com.bibimartins.dto.EmployeeUploadResponse;
import com.bibimartins.entity.Employee;
import com.bibimartins.service.EmployeeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EmployeeUploadResponse> uploadEmployees(
            @PathVariable Long companyId,
            @RequestParam("file") MultipartFile file) {
        EmployeeUploadResponse response = employeeService.uploadEmployeesCsv(companyId, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Employee>> listEmployees(@PathVariable Long companyId) {
        return ResponseEntity.ok(employeeService.getEmployeesByCompany(companyId));
    }
}
