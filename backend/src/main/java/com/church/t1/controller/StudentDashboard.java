package com.church.t1.controller;

import com.church.t1.service.StudentFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentDashboard {

    private final StudentFacade studentFacade;

    @GetMapping("/dashboard")
    public ResponseEntity<com.church.t1.dto.response.StudentDashboard> loadDashboard(
            Principal principal,
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long weekId
    ) {
        return ResponseEntity.ok(
                studentFacade.loadDashboard(principal.getName(), competitionId, weekId)
        );
    }
}
