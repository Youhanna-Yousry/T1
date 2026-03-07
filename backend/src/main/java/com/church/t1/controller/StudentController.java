package com.church.t1.controller;

import com.church.t1.dto.response.DashboardHeader;
import com.church.t1.dto.response.WeeklyProgress;
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
public class StudentController {

    private final StudentFacade studentFacade;

    @GetMapping("/dashboard/header")
    public ResponseEntity<DashboardHeader> getDashboardHeader(
            Principal principal,
            @RequestParam(required = false) Long competitionId
    ) {
        return ResponseEntity.ok(
                studentFacade.getDashboardHeader(principal.getName(), competitionId)
        );
    }

    @GetMapping("/progress/weekly")
    public ResponseEntity<WeeklyProgress> getWeeklyProgress(
            Principal principal,
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long weekId
    ) {
        return ResponseEntity.ok(
                studentFacade.getWeeklyProgress(principal.getName(), competitionId, weekId)
        );
    }
}
