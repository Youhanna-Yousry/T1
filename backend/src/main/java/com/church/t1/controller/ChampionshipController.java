package com.church.t1.controller;

import com.church.t1.dto.response.StudentsLeaderboard;
import com.church.t1.dto.response.WeekSummary;
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

    @GetMapping("/leaderboard/overall")
    public ResponseEntity<StudentsLeaderboard> getChampionshipLeaderboard(
            @RequestParam(required = false) Long competitionId
    ) {
        return ResponseEntity.ok(championshipService.getChampionshipLeaderboard(competitionId));
    }

    @GetMapping("/leaderboard/weekly")
    public ResponseEntity<StudentsLeaderboard> getWeeklyLeaderboard(
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long weekId
    ) {
        return ResponseEntity.ok(championshipService.getWeeklyLeaderboard(competitionId, weekId));
    }

    @GetMapping("/rounds/finished")
    public ResponseEntity<List<WeekSummary>> getFinishedRounds(
            @RequestParam(required = false) Long competitionId
    ) {
        return ResponseEntity.ok(championshipService.getFinishedRounds(competitionId));
    }
}
