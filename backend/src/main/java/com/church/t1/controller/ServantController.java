package com.church.t1.controller;

import com.church.t1.dto.request.AttendanceRequest;
import com.church.t1.dto.response.EventSummary;
import com.church.t1.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servant")
@RequiredArgsConstructor
public class ServantController {

    private final AttendanceService attendanceService;

    @GetMapping("/events")
    public ResponseEntity<List<EventSummary>> getEvents(@RequestParam boolean scannable) {
        return ResponseEntity.ok(attendanceService.getEvents(scannable));
    }

    @PostMapping("/attendance")
    public ResponseEntity<Void> registerAttendance(@RequestBody AttendanceRequest attendanceRequest) {
        attendanceService.registerAttendance(attendanceRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students/search")
    public ResponseEntity<List<String>> searchStudents(@RequestParam String query) {
        return ResponseEntity.ok(attendanceService.findStudents(query));
    }
}
