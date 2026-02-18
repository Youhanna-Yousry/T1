package com.church.t1.controller;

import com.church.t1.dto.response.ChampionshipStanding;
import com.church.t1.service.ChampionshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/championship")
@RequiredArgsConstructor
public class ChampionshipController {

    private final ChampionshipService championshipService;

    @GetMapping("/standings")
    public ResponseEntity<List<ChampionshipStanding>> getStandings(
            @RequestParam(required = false) Long competitionId
    ) {
        return ResponseEntity.ok(championshipService.getStandings(competitionId));
    }
}
