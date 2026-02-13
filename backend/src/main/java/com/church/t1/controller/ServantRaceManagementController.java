package com.church.t1.controller;

import com.church.t1.dto.response.LookupDTO;
import com.church.t1.service.ServantRaceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/servant")
@RequiredArgsConstructor
public class ServantRaceManagementController {

    private final ServantRaceManagementService servantRaceManagementService;

    @GetMapping("/events")
    public ResponseEntity<List<LookupDTO>> getAvailableEvents() {
        return ResponseEntity.ok(servantRaceManagementService.getAvailableEvents());
    }

    @GetMapping("/weeks")
    public ResponseEntity<List<LookupDTO>> getAvailableWeeks() {
        return ResponseEntity.ok(servantRaceManagementService.getAvailableWeeks());
    }
}
