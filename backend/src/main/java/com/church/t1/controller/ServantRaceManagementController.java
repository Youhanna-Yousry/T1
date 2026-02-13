package com.church.t1.controller;

import com.church.t1.dto.request.MarkAttendanceDTO;
import com.church.t1.dto.response.EventInfoDTO;
import com.church.t1.model.enums.AttendanceStatus;
import com.church.t1.service.ServantRaceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servant")
@RequiredArgsConstructor
public class ServantRaceManagementController {

    private final ServantRaceManagementService servantRaceManagementService;

    @GetMapping("/events")
    public ResponseEntity<List<EventInfoDTO>> getEvents(@RequestParam boolean scannable) {
        return ResponseEntity.ok(servantRaceManagementService.getEvents(scannable));
    }

    @PostMapping("/attendance")
    public ResponseEntity<AttendanceStatus> markAttendance(@RequestBody MarkAttendanceDTO markAttendanceDTO) {
        return ResponseEntity.ok(servantRaceManagementService.markAttendance(markAttendanceDTO));
    }
}
