package com.church.t1.controller;

import com.church.t1.dto.response.StudentsLeaderboard;
import com.church.t1.service.ChampionshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/championship")
@RequiredArgsConstructor
public class ChampionshipController {

    private final ChampionshipService championshipService;

    @GetMapping("/standings/drivers")
    public ResponseEntity<StudentsLeaderboard> getStandings(
            @RequestParam(required = false) Long competitionId
    ) {
        return ResponseEntity.ok(championshipService.getStudentsStandings(competitionId));
    }

    @GetMapping("/standings/weekly")
    public ResponseEntity<StudentsLeaderboard> getWeeklyStandings(
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long weekId
    ) {
        return ResponseEntity.ok(championshipService.getWeeklyStandings(competitionId, weekId));
    }
}
