package com.church.t1.controller;

import com.church.t1.dto.response.StudentDashboardDTO;
import com.church.t1.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDTO> getDashboard(
            @RequestParam String username,
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long weekId
    ) {
        return ResponseEntity.ok(
                studentDashboardService.getStudentDashboard(username, competitionId, weekId)
        );
    }
}
