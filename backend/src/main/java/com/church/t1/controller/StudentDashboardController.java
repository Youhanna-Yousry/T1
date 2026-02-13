package com.church.t1.controller;

import com.church.t1.dto.response.StudentDashboardDTO;
import com.church.t1.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDTO> getDashboard(@RequestParam String username) {
        return ResponseEntity.ok(studentDashboardService.getStudentDashboard(username));
    }
}
